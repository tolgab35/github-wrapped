import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GitHub API
const GITHUB_API = "https://api.github.com/graphql";

/* ------------------------ DATE RANGE: last 12 months ------------------------ */
const now = new Date();
const YEAR_END = now.toISOString();

const YEAR_START = new Date();
YEAR_START.setFullYear(YEAR_START.getFullYear() - 1);
const YEAR_START_ISO = YEAR_START.toISOString();

// Previous year range (for growth comparison)
const PREV_YEAR_END = new Date(YEAR_START);
PREV_YEAR_END.setDate(PREV_YEAR_END.getDate() - 1);
const PREV_YEAR_END_ISO = PREV_YEAR_END.toISOString();

const PREV_YEAR_START = new Date(PREV_YEAR_END);
PREV_YEAR_START.setFullYear(PREV_YEAR_START.getFullYear() - 1);
const PREV_YEAR_START_ISO = PREV_YEAR_START.toISOString();

/* ----------------------------- GRAPHQL QUERY ----------------------------- */

const QUERY = `
  query YearSummary($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login
      name
      avatarUrl
      createdAt

      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions

        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }

        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
            url
            stargazerCount
            primaryLanguage {
              name
              color
            }
          }
          contributions {
            totalCount
          }
        }
      }
    }
  }
`;

/* ---------------------------- UTIL FUNCTIONS ---------------------------- */
function calculateGrowth(cur, prev) {
  const sumPrev =
    prev.totalCommitContributions +
    prev.totalIssueContributions +
    prev.totalPullRequestContributions;

  const sumCur =
    cur.totalCommitContributions +
    cur.totalIssueContributions +
    cur.totalPullRequestContributions;

  if (sumPrev <= 0) return null;

  return {
    overallGrowth: Math.round(((sumCur - sumPrev) / sumPrev) * 100),

    commitsGrowth: Math.round(
      ((cur.totalCommitContributions - prev.totalCommitContributions) /
        (prev.totalCommitContributions || 1)) *
        100
    ),

    issuesGrowth: Math.round(
      ((cur.totalIssueContributions - prev.totalIssueContributions) /
        (prev.totalIssueContributions || 1)) *
        100
    ),

    prsGrowth: Math.round(
      ((cur.totalPullRequestContributions -
        prev.totalPullRequestContributions) /
        (prev.totalPullRequestContributions || 1)) *
        100
    ),
  };
}

function calculateStreak(calendar) {
  let max = 0,
    cur = 0;
  for (const d of calendar) {
    if (d.count > 0) {
      cur++;
      max = Math.max(max, cur);
    } else cur = 0;
  }
  return max;
}

function getBestDay(calendar) {
  const map = Array(7).fill(0);
  for (const d of calendar) {
    if (d.count > 0) map[new Date(d.date).getDay()] += d.count;
  }
  const max = Math.max(...map);
  if (max === 0) return "Not enough data";

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[map.indexOf(max)];
}

function getTopLanguages(repos) {
  const langMap = {};

  repos.forEach((entry) => {
    if (!entry.repository.primaryLanguage) return;

    const lang = entry.repository.primaryLanguage.name;
    const color = entry.repository.primaryLanguage.color || "#666666";

    if (!langMap[lang]) {
      langMap[lang] = { count: 0, color: color };
    }

    langMap[lang].count += entry.contributions.totalCount;
  });

  // Calculate total contributions
  const total = Object.values(langMap).reduce(
    (sum, lang) => sum + lang.count,
    0
  );

  if (total === 0) return [];

  // Calculate percentages
  return Object.entries(langMap)
    .map(([name, data]) => ({
      name,
      percent: (data.count / total) * 100,
      color: data.color,
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);
}

function getTopRepos(repos) {
  return repos
    .filter((x) => x.contributions.totalCount > 0)
    .map((x) => ({
      name: x.repository.name,
      url: x.repository.url,
      contributions: x.contributions.totalCount,
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 5);
}

/* ---- MONTHLY COMMITS (MISSING IN YOUR CODE — THIS FIXES THE GRAPH) ---- */

function getMonthlyCommits(calendar) {
  const months = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  for (const d of calendar) {
    const m = new Date(d.date).getMonth();
    const key = Object.keys(months)[m];
    months[key] += d.count;
  }

  return months;
}

/* ---------------------------- MAIN WRAPPED API ---------------------------- */

app.get("/api/wrapped/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const token = process.env.GITHUB_TOKEN;

    if (!token) return res.status(500).json({ error: "Missing GitHub token" });

    const client = new GraphQLClient(GITHUB_API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Fetch current year data
    const data = await client.request(QUERY, {
      login: username,
      from: YEAR_START_ISO,
      to: YEAR_END,
    });

    if (!data.user) return res.status(404).json({ error: "User not found" });

    // Fetch previous year data for growth comparison
    const prevData = await client.request(QUERY, {
      login: username,
      from: PREV_YEAR_START_ISO,
      to: PREV_YEAR_END_ISO,
    });

    const calendar =
      data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
        (w) =>
          w.contributionDays.map((d) => ({
            date: d.date,
            count: d.contributionCount,
          }))
      );

    // Calculate growth using actual previous year data
    const growth = calculateGrowth(
      data.user.contributionsCollection,
      prevData.user.contributionsCollection
    );

    const response = {
      login: data.user.login,
      name: data.user.name,
      avatarUrl: data.user.avatarUrl,

      totalContributions:
        data.user.contributionsCollection.contributionCalendar
          .totalContributions,

      totalCommits: data.user.contributionsCollection.totalCommitContributions,

      totalIssues: data.user.contributionsCollection.totalIssueContributions,

      totalPRs: data.user.contributionsCollection.totalPullRequestContributions,

      topLanguages: getTopLanguages(
        data.user.contributionsCollection.commitContributionsByRepository
      ),

      topRepos: getTopRepos(
        data.user.contributionsCollection.commitContributionsByRepository
      ),

      streak: calculateStreak(calendar),
      bestDay: getBestDay(calendar),

      monthlyCommits: getMonthlyCommits(calendar),

      growth: growth,
    };

    res.json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "GitHub API error" });
  }
});

/* ------------------------- HIGHLIGHTS API ------------------------- */

function fallbackHighlights(s) {
  return [
    {
      emoji: "🔥",
      title: "Streak Runner",
      description: `You kept a ${s.streak}-day streak.`,
    },
    {
      emoji: "📌",
      title: "Best Day",
      description: `Most active on ${s.bestDay}.`,
    },
    {
      emoji: "⭐",
      title: "Top Repo",
      description: `Your best repo: ${s.topRepos?.[0]?.name || "N/A"}.`,
    },
  ];
}

app.post("/api/highlights", async (req, res) => {
  const stats = req.body;

  const prompt = `
Generate exactly 3 fun GitHub Wrapped highlight cards.
Each output has: emoji, title (max 3 words), description (1 sentence).

Return ONLY pure JSON array.

Stats:
${JSON.stringify(stats)}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]") + 1;

    if (start === -1 || end <= 0) return res.json(fallbackHighlights(stats));

    return res.json(JSON.parse(text.slice(start, end)));
  } catch (e) {
    console.error(e);
    return res.json(fallbackHighlights(stats));
  }
});

/* --------------------------- START SERVER --------------------------- */

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
