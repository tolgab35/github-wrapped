import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL || "https://github-wrapped-sepia.vercel.app",
    credentials: true,
  })
);
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

/* ---- MONTHLY COMMITS  ---- */

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

/* ---------------------------- RATE LIMIT API ---------------------------- */

app.get("/api/rate-limit", async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return res.status(500).json({ error: "Missing GitHub token" });

    const response = await fetch("https://api.github.com/rate_limit", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    res.json({
      core: {
        limit: data.resources.core.limit,
        remaining: data.resources.core.remaining,
        reset: data.resources.core.reset,
        used: data.resources.core.used,
      },
      graphql: {
        limit: data.resources.graphql.limit,
        remaining: data.resources.graphql.remaining,
        reset: data.resources.graphql.reset,
        used: data.resources.graphql.used,
      },
    });
  } catch (e) {
    console.error("Rate limit check error:", e.message || "Unknown error");
    res.status(500).json({ error: "Rate limit check failed" });
  }
});

/* ---------------------------- MAIN WRAPPED API ---------------------------- */

app.get("/api/wrapped/:username", async (req, res) => {
  try {
    const username = req.params.username;

    // Username validation (GitHub username format)
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)) {
      return res.status(400).json({ error: "Invalid username format" });
    }

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

    if (!data.user)
      return res.status(404).json({ error: "This GitHub user does not exist" });

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

    // Check rate limit after API calls
    const rateLimitResponse = await fetch("https://api.github.com/rate_limit", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rateLimitData = await rateLimitResponse.json();

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

      rateLimit: {
        remaining: rateLimitData.resources.graphql.remaining,
        limit: rateLimitData.resources.graphql.limit,
        reset: rateLimitData.resources.graphql.reset,
      },
    };

    res.json(response);
  } catch (e) {
    console.error("GitHub API error:", {
      message: e.message,
      type: e.response?.errors?.[0]?.type,
      status: e.status,
    });

    // Check if it's a rate limit error
    if (e.response?.errors?.[0]?.type === "RATE_LIMITED") {
      return res.status(429).json({
        error: "GitHub API rate limit exceeded",
        message: "Please try again later",
      });
    }

    // Check if user not found
    if (
      e.response?.errors?.[0]?.type === "NOT_FOUND" ||
      e.response?.errors?.[0]?.message?.includes("Could not resolve to a User")
    ) {
      return res.status(404).json({ error: "This GitHub user does not exist" });
    }

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

// Cache and quota tracking
const highlightsCache = new Map(); // username: { highlights, timestamp }
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

let apiQuotaExhausted = false;
let quotaResetTime = null;

app.post("/api/highlights", async (req, res) => {
  const stats = req.body;
  const username = stats.login || stats.username || "anonymous";

  // 1. Check cache
  if (highlightsCache.has(username)) {
    const cached = highlightsCache.get(username);
    const now = Date.now();

    // If cache is still valid
    if (now - cached.timestamp < CACHE_DURATION) {
      console.log(`✅ Returning from cache: ${username}`);
      return res.json(cached.highlights);
    } else {
      // Clear expired cache
      highlightsCache.delete(username);
    }
  }

  // 2. Check global quota
  if (apiQuotaExhausted && quotaResetTime && Date.now() < quotaResetTime) {
    console.log(
      `⚠️  API quota exhausted, using fallback. Reset: ${new Date(
        quotaResetTime
      ).toLocaleString("en-US")}`
    );
    return res.json(fallbackHighlights(stats));
  }

  const prompt = `
Generate exactly 3 fun GitHub Wrapped highlight cards.
Each output has: emoji, title (max 3 words), description (1 sentence).

Return ONLY pure JSON array.

Stats:
${JSON.stringify(stats)}
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-09-2025",
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]") + 1;

    if (start === -1 || end <= 0) {
      return res.json(fallbackHighlights(stats));
    }

    const highlights = JSON.parse(text.slice(start, end));

    // Save to cache
    highlightsCache.set(username, {
      highlights,
      timestamp: Date.now(),
    });

    console.log(`✨ AI highlights generated: ${username}`);

    // Reset quota flag if working properly
    if (apiQuotaExhausted) {
      apiQuotaExhausted = false;
      quotaResetTime = null;
      console.log("✅ API quota restored");
    }

    return res.json(highlights);
  } catch (e) {
    console.error("Gemini API error:", {
      message: e.message,
      status: e.status,
    });

    // 429 error (quota exceeded)
    if (e.status === 429) {
      apiQuotaExhausted = true;

      // Use retry delay from API response
      const retryInfo = e.errorDetails?.find(
        (detail) =>
          detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
      );

      if (retryInfo?.retryDelay) {
        const seconds = parseInt(retryInfo.retryDelay);
        quotaResetTime = Date.now() + seconds * 1000;
      } else {
        // Default: reset after 1 hour
        quotaResetTime = Date.now() + 60 * 60 * 1000;
      }

      console.log(
        `❌ API quota exceeded! Reset time: ${new Date(
          quotaResetTime
        ).toLocaleString("en-US")}`
      );
    }

    return res.json(fallbackHighlights(stats));
  }
});

/* --------------------------- START SERVER --------------------------- */

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
