# 🎀 Yuuki: Chess.com Auto-Player & Analyzer

**Yuuki** is a fully client-side, beautifully crafted chess assistant for [Chess.com](https://www.chess.com). Powered by the local **Yuuki Engine** and wrapped in a soft, pastel "Coquette" aesthetic, Yuuki provides 100% offline analysis and human-like auto-play without ever leaving the browser.

---

## ✨ Features

*   🤖 **100% Local & Offline**: Powered by the **Yuuki Engine** running entirely in a Web Worker. No external API calls, no latency, completely private.
*   🎀 **Soft Pastel UI**: A gorgeous "Coquette" themed interface featuring Sakura Pink and Soft Lavender gradients, polka-dot textures, and cute handwritten fonts.
*   🖱️ **Human-like Auto-Play**: Simulates realistic mouse movements with Bézier curves, random delays, and positional jitter. 
*   💖 **Cute Move Visualization**: Click "Ask Yuuki" to see the best move visualized with a soft dotted pastel arrow ending in a **cute little heart** on the target square.
*   🧲 **Physics-Based Bubble**: A draggable floating pink bow bubble with spring physics and momentum inertia.

---

## 🧠 Engine Behavior: The "Swindler" Preset

Under the hood, Yuuki runs a highly tuned "Swindler" configuration designed to mimic a stubborn, trap-setting human player. Instead of playing perfect engine chess, it plays *human* chess.

**Configuration Highlights:**
*   **Search Depth:** 6 (Creates natural "horizon effect" blind spots)
*   **Contempt:** -40 (Prefers accepting draws over grinding lost positions)
*   **Skill Level:** 20 (No artificial random blunders; flaws come organically from shallow depth and aggressive pruning)
*   **Evaluation Weights:** High priority on `TrappedPiecePenalty` (30) and `DiscoveryThreatBonus` (25), but very low penalty for `QueenEarlyDevelopment` (10) and `KnightOnRim` (5).

### 📊 Testing Stats (50 Games)
*   **Win/Draw/Loss:** 37W / 2D / 11L (74.0% win rate)
*   **Average Accuracy:** 82.8% (0.9% lower than opponents, yet wins through tactical chaos)
*   **Opponent Average ELO:** ~1444 (Opponent Average Accuracy: 83.7%)
*   **Peak Rating Achieved:** 1613 (Rapid)
*   **Time Management:** Average 6.08s per move, 0 pre-moves, average game length of 7m 52s (31 moves).

### 🎭 What makes it human-like?
*   **Early Queen Development & Aggression:** Heavily favors the Scandinavian Defense (15 games) and the Blackmar Gambit (7 games), bringing pieces out early for aggressive, chaotic play.
*   **Neglects King Safety:** Out of 50 games, it only castled **once** (a Long Castle), meaning it neglected to castle in 98% of its games—perfectly mimicking a common amateur mistake.
*   **Piece Activity:** Averages 8.4 pawn moves, 5.2 knight moves, and 7.8 captures per game, reflecting a highly tactical and capture-heavy playstyle.
*   **Stubbornness:** It fights in messy positions and relies on human-like traps rather than dry positional squeezes.

**Popular Openings Played:**
*   Scandinavian Defense Mieses Kotrc Variation (15 Games, 60% Win Rate)
*   Queen's Pawn Opening Blackmar Gambit (7 Games, 86% Win Rate)
*   Queen's Pawn Opening Horwitz Defense (3 Games, 67% Win Rate)
*   Van 't Kruijs Opening (3 Games, 67% Win Rate, 33% Draw Rate)
*   Philidor Defense (2 Games, 50% Win Rate)

---

## 🖼️ UI Showcase

![UI Showcase](src/UI%20Showcase.png)

---

## 📦 Installation

1.  **Download** or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** using the toggle in the top right corner.
4.  Click the **Load unpacked** button in the top left.
5.  Select the folder containing the extension files (`manifest.json`, `engine.js`, etc.).
6.  Navigate to [Chess.com](https://www.chess.com), start a game, and look for the floating pink bow! 🎀

---

## 🎮 How to Use

*   **The Bubble ♡**: You will see a cute pink bow floating on your screen. You can drag it around, and it will slide with realistic inertia physics.
*   **The Panel ✧**: Click the bubble to open the soft, pillowy control panel.
*   **Auto-Play ♡**: Toggle the switch to let Yuuki take over. It will automatically detect when it's your turn, "think" for a randomized amount of time, and make the move using simulated human input.
*   **Ask Yuuki ✨**: Click the gradient button to analyze the current position. Yuuki will draw a soft pastel arrow with a heart showing the best move without actually playing it.

---

## 📂 File Structure

*   `manifest.json` — MV3 extension manifest.
*   `engine.js` — Content script: board reading, FEN generation, human-like mouse execution, and local engine bridge.
*   `yuuki-engine.js` — The full Yuuki Engine (UCI-style Web Worker).
*   `ui.js` — Floating control panel, drag/inertia physics, and pastel move visualization.
*   `style.css` — Soft pastel UI styling, animations, and glassmorphic effects.

---

## 👑 Credits & Authors

*   **Extension, UI & Integration**: Developed by **Anne** 🎀
    *   *Mastermind behind the Coquette aesthetic, the stealth DOM integration, and the "Swindler" preset tuning.*
*   **Yuuki Chess Engine**: Developed by **Eryx/RJ** ♟️ 
    *   *Architect of the core C++/JS 0x88 board-representation engine with tapered evaluation and advanced search pruning.*
    *   Repository: [github.com/eryxveilen/yuuki-chess-engine](https://github.com/eryxveilen/yuuki-chess-engine)

---

## ⚠️ Disclaimer

**Please Read Carefully:**
Using bots, engines, or any form of external assistance on Chess.com strictly violates their [Terms of Service and Fair Play policy](https://www.chess.com/cheating). 

This project is created strictly for **educational and entertainment purposes**—specifically to explore JavaScript chess engine development, Web Worker communication, creative UI/UX design, and the boundaries of human-like telemetry simulation. Please do not use this to cheat in rated games.
