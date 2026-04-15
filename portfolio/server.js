const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your GitHub username
const GITHUB_USERNAME = "FuciTF2";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || null;

function githubHeaders() {
  const headers = {
    "User-Agent": "portfolio-app",
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) headers["Authorization"] = `token ${GITHUB_TOKEN}`;
  return headers;
}

app.use(express.static(path.join(__dirname, "public")));

// API route: fetch public GitHub repos
app.get("/api/repos", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
      { headers: githubHeaders() }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    const filtered = repos
      .filter((r) => !r.fork)
      .map((r) => ({
        name: r.name,
        description: r.description || "No description provided.",
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        updated: r.updated_at,
        topics: r.topics || [],
      }));

    res.json(filtered);
  } catch (err) {
    console.error("Error fetching repos:", err.message);
    res.status(500).json({ error: "Failed to fetch repositories." });
  }
});

// API route: fetch latest GitHub activity
app.get("/api/activity", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`,
      { headers: githubHeaders() }
    );

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const events = await response.json();

    const meaningful = events.find(e =>
      ["PushEvent", "CreateEvent", "PullRequestEvent", "IssuesEvent", "WatchEvent", "ForkEvent"].includes(e.type)
    );

    if (!meaningful) return res.json({ activity: null });

    let summary = "";
    const repo = meaningful.repo.name.replace(`${GITHUB_USERNAME}/`, "");
    const repoUrl = `https://github.com/${meaningful.repo.name}`;
    const time = meaningful.created_at;

    switch (meaningful.type) {
      case "PushEvent":
        const commits = meaningful.payload.commits?.length || 1;
        summary = `Pushed ${commits} commit${commits !== 1 ? "s" : ""} to ${repo}`;
        break;
      case "CreateEvent":
        summary = meaningful.payload.ref_type === "repository"
          ? `Created new repo ${repo}`
          : `Created a ${meaningful.payload.ref_type} in ${repo}`;
        break;
      case "PullRequestEvent":
        summary = `${meaningful.payload.action} a pull request in ${repo}`;
        break;
      case "IssuesEvent":
        summary = `${meaningful.payload.action} an issue in ${repo}`;
        break;
      case "WatchEvent":
        summary = `Starred ${repo}`;
        break;
      case "ForkEvent":
        summary = `Forked ${repo}`;
        break;
      default:
        summary = `Active on ${repo}`;
    }

    res.json({ summary, repo, repoUrl, time, type: meaningful.type });
  } catch (err) {
    console.error("Error fetching activity:", err.message);
    res.status(500).json({ error: "Failed to fetch activity." });
  }
});

// Page routes
app.get("/",           (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/about",      (req, res) => res.sendFile(path.join(__dirname, "public", "about.html")));
app.get("/portfolio",  (req, res) => res.sendFile(path.join(__dirname, "public", "portfolio.html")));
app.get("/playground", (req, res) => res.sendFile(path.join(__dirname, "public", "playground.html")));
app.get("/game",       (req, res) => res.sendFile(path.join(__dirname, "public", "game.html")));
app.get("/lore",       (req, res) => res.sendFile(path.join(__dirname, "public", "lore.html")));
app.get("/william",    (req, res) => res.sendFile(path.join(__dirname, "public", "william.html")));
app.get("/henry",      (req, res) => res.sendFile(path.join(__dirname, "public", "henry.html")));
app.get("/frederick",  (req, res) => res.sendFile(path.join(__dirname, "public", "frederick.html")));
app.get("/samuel",     (req, res) => res.sendFile(path.join(__dirname, "public", "samuel.html")));
app.get("/andrew",     (req, res) => res.sendFile(path.join(__dirname, "public", "andrew.html")));
app.get("/chatbot",    (req, res) => res.sendFile(path.join(__dirname, "public", "chatbot.html")));

// 404 — must be last
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio running at http://localhost:${PORT}\n`);
});