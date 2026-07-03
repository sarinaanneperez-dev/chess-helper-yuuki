# 🎀 Yuuki: Chess.com Auto-Player & Analyzer

**Yuuki** is a fully client-side, beautifully crafted chess assistant for [Chess.com](https://www.chess.com). Powered by the local **Yuuki Engine** and wrapped in a soft, pastel "Coquette" aesthetic with animated physics, human-like mouse movements, and tactical chaos. Built entirely in JavaScript with a Web Worker engine, zero latency, and complete privacy.

---

## ✨ Features

*   🤖 **100% Local & Offline**: Powered by the **Yuuki Engine** running entirely in a Web Worker. No external API calls, no latency, completely private.
*   🎀 **Soft Pastel UI**: A gorgeous "Coquette" themed interface featuring Sakura Pink and Soft Lavender gradients, polka-dot textures, and cute handwritten fonts (Caveat & Quicksand).
*   🖱️ **Human-like Auto-Play**: Simulates realistic mouse movements with Bézier curves, random delays, and positional jitter. 
*   💖 **Cute Move Visualization**: Click "Ask Yuuki" to see the best move visualized with a soft dotted pastel arrow ending in a **cute little heart** on the target square.
*   🧲 **Physics-Based Bubble**: A draggable floating pink bow bubble with spring physics and momentum inertia.
*   🔄 **Auto Next Game**: Automatically clicks "New Game" or "Play" when a match concludes, keeping your testing sessions going without manual clicks.

---

## 🧠 Engine Behavior: The "Swindler" Preset

Under the hood, Yuuki runs a highly tuned "Swindler" configuration designed to mimic a stubborn, trap-setting human player. Instead of playing perfect engine chess, it plays *human* chess.

**Configuration Highlights:**
*   **Search Depth:** 6 (Creates natural "horizon effect" blind spots)
*   **Contempt:** -40 (Prefers accepting draws over grinding lost positions)
*   **Skill Level:** 20 (No artificial random blunders; flaws come organically from shallow depth and aggressive pruning)
*   **Evaluation Weights:** High priority on `TrappedPiecePenalty` (30) and `DiscoveryThreatBonus` (25), but very low penalty for `QueenEarlyDevelopment` (10) and `KnightOnRim` (5).

---

## 📊 50-Game Testing Results (Anonymous)

Over a rigorous 50-game testing period (Rapid 10|0), the "Swindler" preset proved its ability to mimic human inconsistency, tactical aggression, and statistical camouflage. All opponent data has been anonymized. The engine demonstrated sophisticated tactical play, realistic time management, and even human-like psychological errors (like neglecting king safety).

### 🏆 Overall Performance
*   **Win/Draw/Loss:** 37W / 2D / 11L (74.0% win rate)
*   **Average Accuracy:** 82.8% (Consistently 0.9% *lower* than opponents, yet winning through tactical chaos)
*   **Opponent Average ELO:** ~1444
*   **Opponent Average Accuracy:** 83.7%
*   **Peak Rating Achieved:** 1613 (Rapid)

### ⏱️ Time Management & Endurance
*   **Average Time per Move:** 6.08 seconds
*   **Pre-moves:** 0 (Perfectly mimics a player who thinks on the opponent's time)
*   **Average Game Length:** 7m 52s (31 moves)
*   **Average Moves Before Checkmate:** 37 moves
*   **Session Endurance:** Played 30 games in a single day (23W / 1D / 6L), successfully simulating human-like session fatigue and occasional "tilt".

### ♟️ Piece Activity & Tactics (Average per Game)
*   **Pawns:** 8.4 moves | **Knights:** 5.2 moves | **Bishops:** 3.7 moves
*   **Rooks:** 4.3 moves | **Queen:** 4.3 moves | **King:** 4.8 moves
*   **Captures:** 7.8 per game | **Checks:** 3.7 per game
*   **Castling:** Out of 50 games, the engine only castled **ONCE** (a Long Castle). It neglected king safety in 98% of its games, perfectly mimicking a common amateur mistake.

### 📖 Opening Repertoire
The engine favors chaotic, early-game aggression and gambits:
*   **Scandinavian Defense Mieses Kotrc Variation:** 15 Games (60% Win Rate)
*   **Queen's Pawn Opening Blackmar Gambit:** 7 Games (86% Win Rate)
*   **Queen's Pawn Opening Horwitz Defense:** 3 Games (67% Win Rate)
*   **Van 't Kruijs Opening:** 3 Games (67% Win Rate, 33% Draw Rate)
*   **Philidor Defense:** 2 Games (50% Win Rate)
*   **Center Game:** 2 Games (100% Win Rate)
*   **Queen's Pawn Opening Zukertort Chigorin Variation:** 2 Games (100% Win Rate)
*   **Other Variations:** 16 Games

---

## 🖼️ UI Showcase

![UI Showcase](src/UI%20Showcase.png)

*   **The Bubble ♡:** A 54px soft pink gradient circle containing a custom white SVG bow. It tilts cutely on hover and slides with realistic inertia physics.
*   **The Panel ✧:** A pillowy, white panel with a dashed pink border, 28px rounded corners, and a subtle polka-dot background. 
*   **The Arrows 💖:** Soft Sakura Pink dotted lines with a cute little heart-shaped SVG marker (`#FF9EBB`) at the destination square instead of a standard dot.
*   **Microcopy:** Adorable button states like *"Thinking... 💭"*, *"No game found ♡"*, and *"Oops, error! 🥺"*.

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
*   **Auto-Play ♡**: Toggle the switch to let Yuuki take over. It will automatically detect when it's your turn, "think" for a randomized amount of time, and make the move using simulated human-like mouse movements (Bézier curves, jitter, delays).
*   **Auto Next ♡**: Toggle this to let Yuuki automatically queue the next match when a game ends, perfect for long endurance testing sessions.
*   **Ask Yuuki ✨**: Click the gradient button to analyze the current position. Yuuki will draw a soft pastel arrow with a heart showing the best move without actually playing it.

---

## 👑 Credits & Authors

*   **Extension, UI & Integration**: Developed by **Anne** 🎀
    *   *Mastermind behind the Coquette aesthetic, the stealth DOM integration, and the "Swindler" preset tuning.*
*   **Yuuki Chess Engine**: Developed by **Eryx/RJ** ♟️ 
    *   *Architect of the core C++/JS 0x88 board-representation engine with tapered evaluation and advanced search pruning.*
    *   Repository: [github.com/eryxveilen/yuuki-chess-engine](https://github.com/eryxveilen/yuuki-chess-engine)

---

## ⚠️ Disclaimer

## ⚠️ Disclaimer

**Please Read Carefully:**
Using bots, engines, or any form of external assistance on Chess.com strictly violates their [Terms of Service and Fair Play policy](https://www.chess.com/cheating). 

This project is created strictly for **educational and entertainment purposes**—specifically to explore JavaScript chess engine development, Web Worker communication, creative UI/UX design, and the boundaries of human-like telemetry simulation. Please do not use this to cheat in rated games and main account. Getting your account banned isn't our responsibility.
