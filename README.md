# 🎀 Yuuki: Chess.com Auto-Player & Analyzer

**Yuuki** is a Chrome extension that plays and analyzes chess on [Chess.com](https://www.chess.com) using a custom, fully client-side JavaScript chess engine. Wrapped in a soft pastel UI, Yuuki provides a delightful visual experience while delivering strong, local engine analysis.

## ✨ Features

*   🤖 **Fully Local Engine**: Powered by **Yuuki**, a custom JavaScript chess engine running entirely in a Web Worker. No external API calls, no latency, and completely offline.
*   🖱️ **Human-like Auto-Play**: Simulates realistic mouse movements (with slight Bézier curves, random delays, and jitter) to play moves automatically on the board. Plus: Human-like decisions, designed carefully using Eryx/RJ's Swindler Preset. Move Accuracy: 81.4% (Low for engines, Standard for humans)   
*   💖 **Move Visualization**: "Ask Yuuki" for the best move and see it visualized with soft dotted arrows and a cute heart on the target square.   

## Engine Behavior (Under the 21-game testing)
**Average Moves Per Game** - Pawns (7.0), Knights (5.3), Bishops (3.8), Rooks (3.4), Queen (4.2), King (4.3)   
**In-board Behaviors Per Game** - Captures (7.5), Checks (3.8)   
**Move Accuracy** - 81.4% (Average for human players under 1500-2000, 1.7% lower than opponents but somehow won 14 games out of 21 through human-like traps and tactics)   

**What makes it human-like?**   
- Scandinavian Defense is it's preferred opening which sents out queen early.   
- As mentioned before, it sents out Queen early for aggressions.   
- Among all the 20 games, it only castled once, a Long Castle.   
- Win/Draw/Lose (14/1/6)   
- Opponent's ELO Testing = ~1740 (Opponent's Average Accuracy: 83.1%)

**Openings it played**   
- Scandinavian Defense Mieses Kotrc Variation (7 Games)   
- Queens Pawn Opening Horwitz Defense (2 Games)   
- Philidor Defense (2 Games)   
- Center Game (2 Games)   
- Others (8 Games with some of them still under Scandinavian with other Variation)   

## 📦 Installation

1.  **Download** or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** using the toggle in the top right corner.
4.  Click the **Load unpacked** button in the top left.
5.  Select the **`src`** folder containing the extension files.
6.  Navigate to [Chess.com](https://www.chess.com), start a game, and look for the floating pink bow!

## 🎮 How to Use

*   **The Bubble**: You will see a cute pink bow floating on your screen. You can drag it around.
*   **The Panel**: Click the bubble to open the soft, pillowy control panel.
*   **Auto-Play ♡**: Toggle the switch to let Yuuki take over. It will automatically detect when it's your turn, "think" for a randomized amount of time, and make the move using simulated human pointer events.
*   **Ask Yuuki ✨**: Click the gradient button to analyze the current position. Yuuki will draw a soft pastel arrow showing the best move without actually playing it.

## 👑 Credits & Authors

*   **Extension, UI & Integration**: Developed by **Anne** 🎀
*   **Yuuki Chess Engine**: Developed by **Eryx/RJ** ♟️ 
    *   Repository: [github.com/yuuki-chess-engine](https://github.com/eryxveilen/yuuki-chess-engine)
    *   *Note: The engine utilized in this extension is the JavaScript counterpart of Eryx's original Yuuki engine.*

## ⚠️ Disclaimer

**Please Read Carefully:**
Using bots, engines, or any form of external assistance on Chess.com strictly violates their [Terms of Service and Fair Play policy](https://www.chess.com/cheating?spm=a2ty_o01.29997173.0.0.332655fbQDHrQn). Using this extension in rated or unrated games will likely result in your account being permanently banned. 

This project is created strictly for **educational and entertainment purposes**—specifically to explore JavaScript chess engine development, Web Worker communication, and creative UI/UX design. **Use it at your own risk.**
