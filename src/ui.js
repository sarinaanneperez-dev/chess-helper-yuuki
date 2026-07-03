window.chessHelper = {
  autoPlay: false,
  debug: true
};

function log(msg) {
  if (window.chessHelper.debug) console.log(`[Yuuki] ${msg}`);
}
window.chessHelperLog = log;

let rootEl, bubbleEl, panelEl;
let drag = {
  active: false,
  currentX: 0, currentY: 0,
  initialX: 0, initialY: 0,
  xOffset: 0, yOffset: 0,
  velocityX: 0, velocityY: 0,
  lastX: 0, lastY: 0,
  lastTime: 0
};

// Custom Cute Bow SVG icon for the floating button
const YUUKI_SVG = `
<svg viewBox="0 0 32 32" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 16C16 16 11 11 7 11C3 11 3 16 7 18C11 20 16 16 16 16Z" fill="#FFF" opacity="0.95"/>
  <path d="M16 16C16 16 21 11 25 11C29 11 29 16 25 18C21 20 16 16 16 16Z" fill="#FFF" opacity="0.95"/>
  <circle cx="16" cy="16" r="3" fill="#FFF"/>
  <path d="M14 19L12 25M18 19L20 25" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
</svg>`;

function initUI() {
  const oldRoot = document.getElementById('chess-helper-root');
  if (oldRoot) oldRoot.remove();

  rootEl = document.createElement('div');
  rootEl.id = 'chess-helper-root';

  // Floating bubble with cute bow
  bubbleEl = document.createElement('div');
  bubbleEl.id = 'chess-helper-bubble';
  bubbleEl.innerHTML = YUUKI_SVG;

  drag.xOffset = window.innerWidth - 80;
  drag.yOffset = 80;
  updateBubbleTransform();

  // Panel - Soft Coquette layout
  panelEl = document.createElement('div');
  panelEl.id = 'chess-helper-panel';
  panelEl.innerHTML = `
    <div class="ch-header">
      <div class="ch-title">✧ Yuuki ✧</div>
    </div>
    <div class="ch-row">
      <span class="ch-label">Auto-Play ♡</span>
      <label class="ch-switch">
        <input type="checkbox" id="ch-toggle-autoplay">
        <span class="ch-slider"></span>
      </label>
    </div>
    <button class="ch-btn" id="ch-btn-analyze">
      <span id="ch-analyze-text">Ask Yuuki ✨</span>
    </button>
  `;

  rootEl.appendChild(bubbleEl);
  rootEl.appendChild(panelEl);
  document.body.appendChild(rootEl);

  setupDragEvents();
  setupButtonEvents();
}

// ── Drag & inertia logic ──────────────────────────────────────────────────────

function setupDragEvents() {
  bubbleEl.addEventListener('mousedown', dragStart);
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('mousemove', dragMove);
  bubbleEl.addEventListener('touchstart', dragStart, { passive: false });
  document.addEventListener('touchend', dragEnd);
  document.addEventListener('touchmove', dragMove, { passive: false });
}

function dragStart(e) {
  if (e.target.closest('#chess-helper-panel')) return;
  drag.active = true;
  drag.lastTime = Date.now();
  if (e.type === "touchstart") {
    drag.initialX = e.touches[0].clientX - drag.xOffset;
    drag.initialY = e.touches[0].clientY - drag.yOffset;
  } else {
    drag.initialX = e.clientX - drag.xOffset;
    drag.initialY = e.clientY - drag.yOffset;
  }
}

function dragEnd(e) {
  if (!drag.active) return;
  drag.active = false;
  startInertia();
}

function dragMove(e) {
  if (drag.active) {
    e.preventDefault();
    let cx = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    let cy = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    drag.currentX = cx - drag.initialX;
    drag.currentY = cy - drag.initialY;

    const now = Date.now();
    const dt = now - drag.lastTime;
    if (dt > 0) {
      drag.velocityX = (drag.currentX - drag.xOffset) / dt;
      drag.velocityY = (drag.currentY - drag.yOffset) / dt;
    }
    drag.lastTime = now;
    drag.xOffset = drag.currentX;
    drag.yOffset = drag.currentY;
    updateBubbleTransform();
    if (panelEl.classList.contains('visible')) closePanel();
  }
}

function updateBubbleTransform() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const size = 54;

  if (drag.xOffset < 0) drag.xOffset = 0;
  if (drag.yOffset < 0) drag.yOffset = 0;
  if (drag.xOffset > w - size) drag.xOffset = w - size;
  if (drag.yOffset > h - size) drag.yOffset = h - size;

  bubbleEl.style.transform = `translate3d(${drag.xOffset}px, ${drag.yOffset}px, 0)`;
}

function startInertia() {
  const speed = Math.sqrt(drag.velocityX * drag.velocityX + drag.velocityY * drag.velocityY);
  if (speed < 0.15) {
    togglePanel();
    return;
  }

  function step() {
    if (drag.active) return;
    drag.velocityX *= 0.92;
    drag.velocityY *= 0.92;
    drag.xOffset += drag.velocityX * 16;
    drag.yOffset += drag.velocityY * 16;
    updateBubbleTransform();
    if (Math.abs(drag.velocityX) > 0.05 || Math.abs(drag.velocityY) > 0.05) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

function togglePanel() {
  if (panelEl.classList.contains('visible')) closePanel();
  else openPanel();
}

function openPanel() {
  updatePanelPosition();
  panelEl.classList.add('visible');
}

function closePanel() {
  panelEl.classList.remove('visible');
}

function updatePanelPosition() {
  const bubbleRect = bubbleEl.getBoundingClientRect();
  const w = window.innerWidth;
  const h = window.innerHeight;
  const panelW = 260;
  const panelH = 180;
  const margin = 16;

  let top, left, originX, originY;

  if (bubbleRect.left > w / 2) {
    left = bubbleRect.left - panelW - margin;
    originX = "right";
  } else {
    left = bubbleRect.right + margin;
    originX = "left";
  }

  if (bubbleRect.top > h / 2) {
    top = bubbleRect.bottom - panelH;
    originY = "bottom";
  } else {
    top = bubbleRect.top;
    originY = "top";
  }

  if (left < margin) left = margin;
  if (left + panelW > w - margin) left = w - panelW - margin;
  if (top < margin) top = margin;
  if (top + panelH > h - margin) top = h - panelH - margin;

  panelEl.style.top = `${top}px`;
  panelEl.style.left = `${left}px`;
  panelEl.style.transformOrigin = `${originX} ${originY}`;
}

// ── Button events ─────────────────────────────────────────────────────────────

function setupButtonEvents() {
  document.getElementById('ch-toggle-autoplay').addEventListener('change', (e) => {
    window.chessHelper.autoPlay = e.target.checked;
    if (window.chessHelper.autoPlay) {
      if (window.chessHelperEngine?.triggerAutoPlay) {
        window.chessHelperEngine.triggerAutoPlay();
      }
    }
  });

  const btnAnalyze = document.getElementById('ch-btn-analyze');
  const btnText = document.getElementById('ch-analyze-text');

  btnAnalyze.onclick = async () => {
    if (!window.chessHelperEngine) return;

    btnText.innerText = "Thinking... 💭";
    const fen = window.chessHelperEngine.getFEN();

    if (!fen) {
      btnText.innerText = "No game found ♡";
      setTimeout(() => btnText.innerText = "Ask Yuuki ✨", 2000);
      return;
    }

    const move = await window.chessHelperEngine.fetchBestMove(fen);
    if (move) {
      drawDottedMove(move);
      btnText.innerText = `Best: ${move.toUpperCase()} ✨`;
    } else {
      btnText.innerText = "Oops, error! 🥺";
    }
    setTimeout(() => btnText.innerText = "Ask Yuuki ✨", 3500);
  };
}

// ── Move visualization (Soft Pastel Theme) ────────────────────────────────────

function drawDottedMove(move) {
  document.querySelectorAll('.ch-highlight, .ch-arrow-svg').forEach(el => el.remove());

  const board = document.querySelector('wc-chess-board') || document.querySelector('.board') || document.querySelector('chess-board');
  if (!board || !move) return;

  const startSq = move.substring(0, 2);
  const endSq = move.substring(2, 4);
  const colToNum = { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8 };
  const algToSquareClass = (sq) => `square-${colToNum[sq[0]]}${sq[1]}`;

  function createHighlight(sq, color) {
    const div = document.createElement('div');
    div.className = `ch-highlight ${algToSquareClass(sq)}`;
    div.style.backgroundColor = color;
    board.appendChild(div);
  }

  // Soft pastel pink and lavender highlights
  createHighlight(startSq, 'rgba(255, 183, 197, 0.5)');  // Sakura Pink
  createHighlight(endSq, 'rgba(200, 182, 255, 0.6)');    // Soft Lavender

  const isFlipped = board.classList.contains('flipped');

  const getCenter = (sq) => {
    let col = colToNum[sq[0]];
    let row = parseInt(sq[1]);
    let x, y;
    const size = 12.5;
    const half = 6.25;
    if (!isFlipped) {
      x = (col - 1) * size + half;
      y = (8 - row) * size + half;
    } else {
      x = (8 - col) * size + half;
      y = (row - 1) * size + half;
    }
    return { x, y };
  };

  const s = getCenter(startSq);
  const e = getCenter(endSq);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.classList.add('ch-arrow-svg');

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", s.x); line.setAttribute("y1", s.y);
  line.setAttribute("x2", e.x); line.setAttribute("y2", e.y);
  line.classList.add('ch-arrow-line');

  // Cute little heart at the target square instead of a dot
  const heart = document.createElementNS("http://www.w3.org/2000/svg", "path");
  heart.setAttribute("d", "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z");
  heart.setAttribute("transform", `translate(${e.x - 4}, ${e.y - 4}) scale(0.35)`);
  heart.setAttribute("fill", "#FF9EBB");

  svg.appendChild(line);
  svg.appendChild(heart);
  board.appendChild(svg);

  setTimeout(() => {
    document.querySelectorAll('.ch-highlight, .ch-arrow-svg').forEach(el => el.remove());
  }, 4000);
}

// ── Init ──────────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}