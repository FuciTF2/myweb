// ===========================
// GitHub Repos Fetcher
// ===========================

const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Ruby: "#701516",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function renderRepo(repo, index) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] || "#c8f060") : null;

  return `
    <article class="repo-card" style="animation-delay: ${index * 0.05}s">
      <div class="repo-card-header">
        <div class="repo-name">
          <a href="${repo.url}" target="_blank" rel="noopener">${repo.name}</a>
        </div>
        ${repo.language ? `<span class="repo-lang" style="color:${langColor}; background: ${langColor}18">${repo.language}</span>` : ""}
      </div>
      <p class="repo-desc">${repo.description}</p>
      <div class="repo-footer">
        <span class="repo-stat">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
          ${repo.stars}
        </span>
        <span class="repo-stat">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>
          ${repo.forks}
        </span>
        <span class="repo-stat">Updated ${timeAgo(repo.updated)}</span>
      </div>
    </article>
  `;
}

async function loadRepos() {
  const grid = document.getElementById("repos-grid");
  const errorEl = document.getElementById("repos-error");
  const countEl = document.getElementById("repo-count");

  try {
    const res = await fetch("/api/repos");
    if (!res.ok) throw new Error("API error");
    const repos = await res.json();

    if (!repos.length) {
      grid.innerHTML = `<p style="padding:2rem; color: var(--text-muted); font-family: var(--font-mono); font-size:.85rem">No public repositories found.</p>`;
      countEl.textContent = "0 repos";
      return;
    }

    countEl.textContent = `${repos.length} public repo${repos.length !== 1 ? "s" : ""}`;
    grid.innerHTML = repos.map((r, i) => renderRepo(r, i)).join("");

  } catch (err) {
    console.error(err);
    grid.innerHTML = "";
    errorEl.classList.remove("hidden");
    countEl.textContent = "failed to load";
  }
}

// ===========================
// Scroll-reveal animation
// ===========================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".project-card, .section-header").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// ===========================
// Init
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  loadRepos();
  initScrollReveal();
});
