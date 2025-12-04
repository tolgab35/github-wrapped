import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_API = "https://api.github.com/graphql";

// 2025 range
const YEAR_2025_START = "2024-12-01T00:00:00Z";
const YEAR_2025_END = "2025-12-01T23:59:59Z";

// 2024 range (for comparison)
const YEAR_2024_START = "2023-12-01T00:00:00Z";
const YEAR_2024_END = "2024-12-01T23:59:59Z";

// GraphQL Query
const QUERY = `
  query YearSummary($login: String!, $from2025: DateTime!, $to2025: DateTime!, $from2024: DateTime!, $to2024: DateTime!) {
    user(login: $login) {
      login
      name
      avatarUrl
      createdAt
      contributionsCollection2025: contributionsCollection(from: $from2025, to: $to2025) {
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

      contributionsCollection2024: contributionsCollection(from: $from2024, to: $to2024) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
      }

      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
        nodes {
          name
          url
          stargazerCount
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
`;

// Streak calculation
function calculateStreak(calendar) {
  let max = 0;
  let current = 0;

  for (const day of calendar) {
    if (day.count > 0) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}

// Find the best day
function getBestDay(calendar) {
  const map = [0, 0, 0, 0, 0, 0, 0];

  for (const day of calendar) {
    if (day.count > 0) {
      map[new Date(day.date).getDay()] += day.count;
    }
  }

  const max = Math.max(...map);
  if (max === 0) return "Not enough data";

  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return names[map.indexOf(max)];
}

// Calculate top languages
function getTopLanguages(repos) {
  const langMap = {};

  repos.forEach((entry) => {
    if (!entry.repository.primaryLanguage) return;
    const lang = entry.repository.primaryLanguage.name;

    if (!langMap[lang]) {
      langMap[lang] = {
        count: 0,
        color: entry.repository.primaryLanguage.color,
      };
    }

    langMap[lang].count += entry.contributions.totalCount;
  });

  const total = Object.values(langMap).reduce((sum, x) => sum + x.count, 0);
  if (total === 0) return [];

  return Object.entries(langMap)
    .map(([name, data]) => ({
      name,
      percent: (data.count / total) * 100,
      color: data.color,
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);
}

// Top repositories
function getTopRepos(repos) {
  return repos
    .filter((r) => r.contributions.totalCount > 0)
    .map((r) => ({
      name: r.repository.name,
      url: r.repository.url,
      contributions: r.contributions.totalCount,
      stargazers: r.repository.stargazerCount,
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 5);
}

// Yearly comparison
function calculateGrowth(c2025, c2024) {
  const sum24 =
    c2024.totalCommitContributions +
    c2024.totalIssueContributions +
    c2024.totalPullRequestContributions;
  const sum25 =
    c2025.totalCommitContributions +
    c2025.totalIssueContributions +
    c2025.totalPullRequestContributions;

  if (sum24 < 10) return null;

  return {
    overallGrowth: Math.round(((sum25 - sum24) / sum24) * 100),
    commitsGrowth: Math.round(
      ((c2025.totalCommitContributions - c2024.totalCommitContributions) /
        (c2024.totalCommitContributions || 1)) *
        100
    ),
    issuesGrowth: Math.round(
      ((c2025.totalIssueContributions - c2024.totalIssueContributions) /
        (c2024.totalIssueContributions || 1)) *
        100
    ),
    prsGrowth: Math.round(
      ((c2025.totalPullRequestContributions -
        c2024.totalPullRequestContributions) /
        (c2024.totalPullRequestContributions || 1)) *
        100
    ),
  };
}

// Main endpoint
app.get("/api/wrapped/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const token = process.env.GITHUB_TOKEN;
    if (!token) return res.status(500).json({ error: "Missing GitHub token" });

    const client = new GraphQLClient(GITHUB_API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await client.request(QUERY, {
      login: username,
      from2025: YEAR_2025_START,
      to2025: YEAR_2025_END,
      from2024: YEAR_2024_START,
      to2024: YEAR_2024_END,
    });

    if (!data.user) return res.status(404).json({ error: "User not found" });

    // Calendar flatten
    const calendar =
      data.user.contributionsCollection2025.contributionCalendar.weeks.flatMap(
        (w) =>
          w.contributionDays.map((d) => ({
            date: d.date,
            count: d.contributionCount,
          }))
      );

    const response = {
      login: data.user.login,
      name: data.user.name,
      avatarUrl: data.user.avatarUrl,
      totalContributions:
        data.user.contributionsCollection2025.contributionCalendar
          .totalContributions,
      totalCommits:
        data.user.contributionsCollection2025.totalCommitContributions,
      totalIssues:
        data.user.contributionsCollection2025.totalIssueContributions,
      totalPRs:
        data.user.contributionsCollection2025.totalPullRequestContributions,
      totalReviews:
        data.user.contributionsCollection2025
          .totalPullRequestReviewContributions,
      topLanguages: getTopLanguages(
        data.user.contributionsCollection2025.commitContributionsByRepository
      ),
      topRepos: getTopRepos(
        data.user.contributionsCollection2025.commitContributionsByRepository
      ),
      streak: calculateStreak(calendar),
      bestDay: getBestDay(calendar),
      githubAnniversary:
        new Date().getFullYear() - new Date(data.user.createdAt).getFullYear(),
      growth: calculateGrowth(
        data.user.contributionsCollection2025,
        data.user.contributionsCollection2024
      ),
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GitHub API Error", detail: err.message });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
