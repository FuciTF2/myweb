// canvas.js — drawing canvas toy

const PALETTE = [
  "#1a1814", "#e8622a", "#f0a500", "#3a86ff",
  "#8338ec", "#2a9d5c", "#e63946", "#f5f0e8",
  "#ff6b9d", "#00b4d8", "#ffd166", "#06d6a0",
];

let currentTool  = "brush";
let currentColour = "#e8622a";
let brushSize    = 8;
let painting     = false;
let lastX        = 0;
let lastY        = 0;
let particles    = [];
let animFrame    = null;

function initCanvas() {
  const canvas  = document.getElementById("drawing-canvas");
  const wrap    = document.querySelector(".canvas-wrap");
  const ctx     = canvas.getContext("2d");

  function resize() {
    // Save current drawing
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width  = wrap.clientWidth;
    canvas.height = Math.min(500, Math.max(350, wrap.clientWidth * 0.55));
    // Restore white bg then drawing
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(img, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  // Fill white on init
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ---- Colour swatches ----
  const swatchContainer = document.getElementById("colour-swatches");
  PALETTE.forEach(hex => {
    const btn = document.createElement("button");
    btn.className = "colour-swatch";
    btn.style.background = hex;
    btn.title = hex;
    if (hex === currentColour) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentColour = hex;
      document.getElementById("custom-colour").value = hex;
      document.querySelectorAll(".colour-swatch").forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
    });
    swatchContainer.appendChild(btn);
  });

  // Custom colour input
  document.getElementById("custom-colour").addEventListener("input", e => {
    currentColour = e.target.value;
    document.querySelectorAll(".colour-swatch").forEach(s => s.classList.remove("active"));
  });

  // Brush size
  document.getElementById("brush-size").addEventListener("input", e => {
    brushSize = parseInt(e.target.value);
  });

  // Tool buttons
  document.querySelectorAll(".tool-btn[data-tool]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentTool = btn.dataset.tool;
      document.querySelectorAll(".tool-btn[data-tool]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      canvas.style.cursor = currentTool === "eraser" ? "cell"
        : currentTool === "bucket" ? "crosshair"
        : "crosshair";
    });
  });

  // Clear
  document.getElementById("canvas-clear").addEventListener("click", () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles = [];
  });

  // Save
  document.getElementById("canvas-save").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "willdevbrook-canvas.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  // ---- Drawing ----
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return {
      x: src.clientX - rect.left,
      y: src.clientY - rect.top,
    };
  }

  function drawBrush(x, y, fromX, fromY) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : currentColour;
    ctx.lineWidth   = brushSize;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.stroke();
  }

  function spawnParticles(x, y) {
    const count = Math.floor(brushSize / 2) + 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.04 + 0.02,
        size: Math.random() * brushSize * 0.4 + 2,
        colour: currentColour,
      });
    }
    // Also draw a small dot at cursor
    ctx.beginPath();
    ctx.arc(x, y, brushSize * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = currentColour;
    ctx.fill();
  }

  function animateParticles() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.colour;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // slight gravity
      p.life -= p.decay;
    });
    ctx.globalAlpha = 1;
    if (particles.length > 0) {
      animFrame = requestAnimationFrame(animateParticles);
    } else {
      animFrame = null;
    }
  }

  // Flood fill (bucket tool)
  function floodFill(startX, startY, fillColour) {
    startX = Math.floor(startX);
    startY = Math.floor(startY);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    const idx = (startY * w + startX) * 4;
    const targetR = data[idx];
    const targetG = data[idx + 1];
    const targetB = data[idx + 2];
    const targetA = data[idx + 3];

    // Parse fill colour
    const tmp = document.createElement("canvas");
    tmp.width = tmp.height = 1;
    const tctx = tmp.getContext("2d");
    tctx.fillStyle = fillColour;
    tctx.fillRect(0, 0, 1, 1);
    const fc = tctx.getImageData(0, 0, 1, 1).data;
    const fillR = fc[0], fillG = fc[1], fillB = fc[2], fillA = fc[3];

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    function match(i) {
      return Math.abs(data[i] - targetR) < 20 &&
             Math.abs(data[i+1] - targetG) < 20 &&
             Math.abs(data[i+2] - targetB) < 20 &&
             Math.abs(data[i+3] - targetA) < 20;
    }

    const stack = [[startX, startY]];
    const visited = new Uint8Array(w * h);

    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue;
      const pos = cy * w + cx;
      if (visited[pos]) continue;
      visited[pos] = 1;
      const i = pos * 4;
      if (!match(i)) continue;
      data[i]   = fillR;
      data[i+1] = fillG;
      data[i+2] = fillB;
      data[i+3] = fillA;
      stack.push([cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // ---- Event listeners ----
  function startDraw(e) {
    e.preventDefault();
    const { x, y } = getPos(e);
    if (currentTool === "bucket") {
      floodFill(x, y, currentColour);
      return;
    }
    painting = true;
    lastX = x;
    lastY = y;
    if (currentTool === "particle") {
      spawnParticles(x, y);
      if (!animFrame) animFrame = requestAnimationFrame(animateParticles);
    } else {
      drawBrush(x, y, x, y);
    }
  }

  function draw(e) {
    e.preventDefault();
    if (!painting) return;
    const { x, y } = getPos(e);
    if (currentTool === "particle") {
      spawnParticles(x, y);
      if (!animFrame) animFrame = requestAnimationFrame(animateParticles);
    } else {
      drawBrush(x, y, lastX, lastY);
    }
    lastX = x;
    lastY = y;
  }

  function stopDraw() { painting = false; }

  canvas.addEventListener("mousedown",  startDraw);
  canvas.addEventListener("mousemove",  draw);
  canvas.addEventListener("mouseup",    stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);
  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove",  draw,      { passive: false });
  canvas.addEventListener("touchend",   stopDraw);
}

document.addEventListener("DOMContentLoaded", initCanvas);