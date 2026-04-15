// commits.js — commit message generator

const messages = {
  believable: [
    { prefix: "fix:", text: "resolve edge case in input validation" },
    { prefix: "feat:", text: "add error handling for null response" },
    { prefix: "refactor:", text: "extract helper function for reusability" },
    { prefix: "fix:", text: "correct off-by-one error in loop" },
    { prefix: "chore:", text: "update dependencies to latest versions" },
    { prefix: "fix:", text: "handle undefined state on initial render" },
    { prefix: "perf:", text: "reduce unnecessary re-renders" },
    { prefix: "fix:", text: "correct typo in variable name" },
    { prefix: "feat:", text: "add loading state to async request" },
    { prefix: "docs:", text: "update README with setup instructions" },
    { prefix: "fix:", text: "prevent duplicate entries on form submit" },
    { prefix: "refactor:", text: "simplify conditional logic" },
    { prefix: "fix:", text: "resolve race condition in async handler" },
    { prefix: "chore:", text: "remove unused imports" },
    { prefix: "fix:", text: "sanitize user input before processing" },
    { prefix: "feat:", text: "implement retry logic on failed requests" },
    { prefix: "fix:", text: "correct date formatting in display" },
    { prefix: "style:", text: "fix inconsistent indentation" },
    { prefix: "fix:", text: "ensure cleanup on component unmount" },
    { prefix: "refactor:", text: "move constants to config file" },
  ],

  wacky: [
    { prefix: "fix:", text: "appease the dark gods of the linter" },
    { prefix: "feat:", text: "add feature that definitely won't cause problems" },
    { prefix: "chore:", text: "rename variable to something slightly less stupid" },
    { prefix: "fix:", text: "stop the button from doing the wrong thing (again)" },
    { prefix: "feat:", text: "implement solution found on page 7 of google results" },
    { prefix: "fix:", text: "undo what I did in the last commit" },
    { prefix: "refactor:", text: "make the code look like I know what I'm doing" },
    { prefix: "fix:", text: "it was a CSS issue. it's always a CSS issue" },
    { prefix: "chore:", text: "delete code I was too afraid to delete six months ago" },
    { prefix: "feat:", text: "add the thing my brain told me to add at 2am" },
    { prefix: "fix:", text: "move semicolon one character to the left" },
    { prefix: "docs:", text: "write comment explaining why this makes no sense" },
    { prefix: "fix:", text: "replace clever solution with one that actually works" },
    { prefix: "chore:", text: "remove console.log I definitely meant to remove" },
    { prefix: "feat:", text: "implement dark pattern disguised as UX improvement" },
    { prefix: "fix:", text: "stop everything from being on fire" },
    { prefix: "refactor:", text: "reorganize code into chaos that is slightly more organized" },
    { prefix: "fix:", text: "the bug was me. I was the bug" },
    { prefix: "chore:", text: "stare at code until it works, then commit" },
    { prefix: "feat:", text: "add loading spinner so it looks like something is happening" },
  ],

  desperate: [
    { prefix: "fix:", text: "please work please work please work" },
    { prefix: "fix:", text: "ok this has to be it" },
    { prefix: "wip:", text: "I don't know what I'm doing anymore" },
    { prefix: "fix:", text: "tried everything. this is attempt number 14" },
    { prefix: "hotfix:", text: "production is on fire send help" },
    { prefix: "fix:", text: "reverting my revert of the revert" },
    { prefix: "fix:", text: "it works locally I don't understand" },
    { prefix: "wip:", text: "going insane. committing before I lose everything" },
    { prefix: "fix:", text: "stack overflow said this would work" },
    { prefix: "fix:", text: "added a setTimeout. yes I know. yes it works. leave me alone" },
    { prefix: "fix:", text: "ok I think I broke something else but the original bug is gone" },
    { prefix: "hotfix:", text: "users are calling. I have not slept" },
    { prefix: "fix:", text: "turns out I was importing the wrong file this entire time" },
    { prefix: "wip:", text: "committing so I have something to go back to when I ruin it" },
    { prefix: "fix:", text: "I asked ChatGPT and it made it worse" },
    { prefix: "fix:", text: "it was a missing comma. seven hours. a missing comma" },
    { prefix: "fix:", text: "I have no idea why this works but it does" },
    { prefix: "hotfix:", text: "deploying and immediately going to bed" },
    { prefix: "fix:", text: "turned it off and on again. committed the off-and-on-again" },
    { prefix: "wip:", text: "saving progress before this computer goes out the window" },
  ],

  bullshit: [
    { prefix: "feat:", text: "leverage synergistic cross-platform paradigm shifts" },
    { prefix: "refactor:", text: "optimise blockchain-adjacent microservice throughput" },
    { prefix: "fix:", text: "resolve impedance mismatch in the quantum state layer" },
    { prefix: "feat:", text: "implement AI-powered button that does what buttons do" },
    { prefix: "chore:", text: "migrate to cloud-native serverless edge-first architecture" },
    { prefix: "fix:", text: "patch zero-day vulnerability introduced in last commit" },
    { prefix: "feat:", text: "add machine learning to the dropdown menu" },
    { prefix: "refactor:", text: "decompose monolith into 47 microservices for scalability" },
    { prefix: "fix:", text: "align stakeholder expectations with deliverable velocity" },
    { prefix: "feat:", text: "introduce proprietary algorithm (it's an if statement)" },
    { prefix: "chore:", text: "increase test coverage from 0% to 0.1%" },
    { prefix: "feat:", text: "implement Web3-ready decentralised login (it's a text field)" },
    { prefix: "fix:", text: "resolve technical debt accrued in previous fiscal quarter" },
    { prefix: "refactor:", text: "pivot to event-driven reactive observability pipeline" },
    { prefix: "feat:", text: "add NFT support to the about page" },
    { prefix: "fix:", text: "address performance concerns raised by nobody in particular" },
    { prefix: "chore:", text: "convert codebase to tabs. convert back to spaces. document decision" },
    { prefix: "feat:", text: "productionise the proof of concept that became production" },
    { prefix: "fix:", text: "remediate cross-functional alignment gap in the footer" },
    { prefix: "feat:", text: "disrupt the commit message space with innovative solution" },
  ],
};

let currentMood = "believable";
let lastIndex = -1;

function getRandom(mood) {
  const pool = messages[mood];
  let idx;
  do { idx = Math.floor(Math.random() * pool.length); } while (idx === lastIndex && pool.length > 1);
  lastIndex = idx;
  return pool[idx];
}

function generate() {
  const msg = getRandom(currentMood);
  const prefixEl = document.getElementById("commit-prefix");
  const textEl = document.getElementById("commit-text");
  const copyBtn = document.getElementById("commit-copy");

  prefixEl.textContent = msg.prefix;
  textEl.textContent = msg.text;

  // Reset copy button
  copyBtn.textContent = "copy";
  copyBtn.classList.remove("copied");

  // Animate
  const output = document.querySelector(".commit-output");
  output.classList.remove("pop");
  void output.offsetWidth; // reflow
  output.classList.add("pop");
}

function copyMessage() {
  const prefix = document.getElementById("commit-prefix").textContent;
  const text = document.getElementById("commit-text").textContent;
  const full = `${prefix} ${text}`;

  navigator.clipboard.writeText(full).then(() => {
    const btn = document.getElementById("commit-copy");
    btn.textContent = "copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "copy";
      btn.classList.remove("copied");
    }, 2000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Mood buttons
  document.querySelectorAll(".mood-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentMood = btn.dataset.mood;
      generate();
    });
  });

  // Generate button
  document.getElementById("commit-generate").addEventListener("click", generate);

  // Copy button
  document.getElementById("commit-copy").addEventListener("click", copyMessage);

  // Generate one on load
  generate();
});