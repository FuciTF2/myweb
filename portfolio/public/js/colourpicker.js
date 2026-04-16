// colourpicker.js — mood based colour picker

// Each colour entry: hex, name, description
// There are 4^5 = 1024 possible combos but we map groups of answers
// to a colour based on a simple hash so similar answers get similar vibes

const colours = [
  { hex: "#e8622a", name: "Functional Orange",      desc: "You are technically coping. The colour of getting things done despite everything." },
  { hex: "#f0a500", name: "Optimistic Yellow",       desc: "Suspiciously cheerful. Something is either going very right or very wrong." },
  { hex: "#3a86ff", name: "Dependable Blue",         desc: "Reliable. Steady. Possibly a bit tired but holding it together." },
  { hex: "#8338ec", name: "Chaotic Purple",          desc: "Vibrating on a frequency most people can't detect. Respect." },
  { hex: "#2a9d5c", name: "Inexplicably Calm Green", desc: "Either very at peace or completely dissociated. Either way, valid." },
  { hex: "#e63946", name: "Aggressive Red",          desc: "Passionate. Possibly about something that doesn't matter. Passionate nonetheless." },
  { hex: "#457b9d", name: "Contemplative Slate",     desc: "Deep in thought about something. Probably not what you should be thinking about." },
  { hex: "#f4a261", name: "Warm Beige Energy",       desc: "Comfortable. Not exciting. Comfortable." },
  { hex: "#6d6875", name: "Existential Mauve",       desc: "Quietly questioning things. The colour of staring out a window." },
  { hex: "#a8dadc", name: "Dissociative Aqua",       desc: "Present in body. Elsewhere in mind. A classic." },
  { hex: "#ffb703", name: "Chaotic Neutral Gold",    desc: "You picked a number and it said a lot about you. This is that." },
  { hex: "#606c38", name: "Grounded Olive",          desc: "Earthy. Practical. Has probably eaten recently, unlike some people." },
  { hex: "#d62828", name: "Unhinged Crimson",        desc: "Something is going on with you today. The colour knows." },
  { hex: "#023e8a", name: "Deep Midnight",           desc: "Introspective to the point of concern. Have you been outside recently." },
  { hex: "#b5838d", name: "Gentle Chaos Rose",       desc: "Soft on the outside, actively spiralling on the inside. Relatable." },
  { hex: "#52b788", name: "Tentatively Hopeful Mint",desc: "Things might be okay. You're not committing to that yet but it's possible." },
];

const answers = [];
let currentStep = 0;
const totalSteps = 5;

function hashAnswers(ans) {
  // Map answers to numbers and combine into an index
  const map = { a: 0, b: 1, c: 2, d: 3 };
  let val = 0;
  ans.forEach((a, i) => {
    val += (map[a] + 1) * (i + 1) * 3;
  });
  return val % colours.length;
}

function showStep(step) {
  document.querySelectorAll(".cq-step").forEach(el => el.classList.remove("active"));
  const stepEl = document.querySelector(`.cq-step[data-step="${step}"]`);
  if (stepEl) {
    stepEl.classList.add("active");
    stepEl.style.animation = "none";
    void stepEl.offsetWidth;
    stepEl.style.animation = "";
  }

  // Update progress dots
  document.querySelectorAll(".cq-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i <= step);
    dot.classList.toggle("done", i < step);
  });
}

function showResult() {
  const idx = hashAnswers(answers);
  const colour = colours[idx];

  document.getElementById("cq-swatch").style.background = colour.hex;
  document.getElementById("cq-colour-name").textContent = colour.name;
  document.getElementById("cq-colour-hex").textContent = colour.hex;
  document.getElementById("cq-colour-desc").textContent = colour.desc;

  document.getElementById("cq-flow").classList.add("hidden");
  document.getElementById("cq-progress").classList.add("hidden");
  document.getElementById("cq-result").classList.remove("hidden");

  // Copy hex
  document.getElementById("cq-copy").onclick = () => {
    navigator.clipboard.writeText(colour.hex).then(() => {
      const btn = document.getElementById("cq-copy");
      btn.textContent = "copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "copy hex";
        btn.classList.remove("copied");
      }, 2000);
    });
  };
}

function restart() {
  answers.length = 0;
  currentStep = 0;

  // Reset all buttons
  document.querySelectorAll(".cq-btn").forEach(b => b.classList.remove("selected"));

  document.getElementById("cq-flow").classList.remove("hidden");
  document.getElementById("cq-progress").classList.remove("hidden");
  document.getElementById("cq-result").classList.add("hidden");

  showStep(0);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cq-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const step = parseInt(btn.closest(".cq-step").dataset.step);
      if (step !== currentStep) return;

      // Mark selected
      btn.closest(".cq-options").querySelectorAll(".cq-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      answers[step] = btn.dataset.value;

      setTimeout(() => {
        currentStep++;
        if (currentStep >= totalSteps) {
          showResult();
        } else {
          showStep(currentStep);
        }
      }, 300);
    });
  });

  document.getElementById("cq-restart").addEventListener("click", restart);
});