const pieceToFen = {
    'wp': 'P', 'wn': 'N', 'wb': 'B', 'wr': 'R', 'wq': 'Q', 'wk': 'K',
    'bp': 'p', 'bn': 'n', 'bb': 'b', 'br': 'r', 'bq': 'q', 'bk': 'k'
};
const colToNum = { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8 };

// ============================================================================
//  BACKGROUND TIMER WORKER (Bypasses main-thread background throttling)
// ============================================================================
const timerWorkerCode = `
    let intervals = {};
    self.onmessage = function(e) {
        const { action, id, ms } = e.data;
        if (action === 'start') {
            if (intervals[id]) clearInterval(intervals[id]);
            intervals[id] = setInterval(() => {
                postMessage({ id: id });
            }, ms);
        } else if (action === 'stop') {
            if (intervals[id]) {
                clearInterval(intervals[id]);
                delete intervals[id];
            }
        }
    };
`;
const timerWorkerBlob = new Blob([timerWorkerCode], { type: 'application/javascript' });
const timerWorker = new Worker(URL.createObjectURL(timerWorkerBlob));

const activeTimers = {};
function setWorkerInterval(callback, ms) {
    const id = 'timer_' + Math.random().toString(36).substr(2, 9);
    activeTimers[id] = callback;
    timerWorker.postMessage({ action: 'start', id: id, ms: ms });
    return id;
}
function clearWorkerInterval(id) {
    if (activeTimers[id]) {
        delete activeTimers[id];
        timerWorker.postMessage({ action: 'stop', id: id });
    }
}
timerWorker.onmessage = function(e) {
    const id = e.data.id;
    if (activeTimers[id]) {
        activeTimers[id]();
    }
};

// ============================================================================
//  Local Yuuki Engine integration
// ============================================================================
const SEARCH_DEPTH = 6;
const ENGINE_OPTIONS = {
    "Skill Level": 20,  "Contempt": -40,  "DrawScore": 0,
    "PawnValue": 100,  "KnightValue": 320,  "BishopValue": 330,  "RookValue": 500,  "QueenValue": 950,
    "NullMoveReduction": 3,  "NullMoveDepthLimit": 3,  "LMRDepthThreshold": 3,  "LMRMoveCountThreshold": 3,
    "AspirationWindow": 25,  "FutilityMargin": 100,  "FutilityDepthLimit": 3,  "RazorMargin": 300,  "RazorDepthLimit": 2,
    "SingularExtensionMargin": 50,  "SingularExtensionDepth": 6,  "KingSafetyWeight": 100,  "MobilityWeight": 8,
    "PawnStructureWeight": 12,  "PassedPawnWeight": 50,  "IsolatedPawnPenalty": 15,  "DoubledPawnPenalty": 10,
    "BackwardPawnPenalty": 12,  "BishopPairBonus": 30,  "RookOnOpenFile": 20,  "RookOnSemiOpenFile": 10,
    "RookOnSeventhRank": 20,  "KnightOutpostBonus": 15,  "KnightOnRimPenalty": 5,  "TempoBonus": 10,
    "SpaceWeight": 2,  "ThreatWeight": 15,  "TrappedPiecePenalty": 30,  "OverextendedPawnPenalty": 8,
    "PawnChainBonus": 8,  "CentralPawnBonus": 15,  "AdvancedPawnBonus": 10,  "KingTropismWeight": 6,
    "PawnShieldWeight": 20,  "PawnStormWeight": 15,  "AttackZoneWeight": 14,  "QueenEarlyDevelopmentPenalty": 10,
    "RookCoordinationBonus": 5,  "MinorBehindPawnBonus": 5,  "BadBishopPenalty": 8,  "PinnedPiecePenalty": 10,
    "DiscoveryThreatBonus": 25,  "MaterialImbalanceWeight": 5,  "InitiativeWeight": 12
};

let engineWorker = null;
let engineReady = false;
let pendingBestMove = null;

function log(msg) {
    if (window.chessHelper && window.chessHelper.debug) console.log(`[Yuuki] ${msg}\n`);
}

async function initEngine() {
    try {
        const engineUrl = chrome.runtime.getURL('yuuki-engine.js');
        const code = await (await fetch(engineUrl)).text();
        const blobUrl = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
        engineWorker = new Worker(blobUrl);
        
        engineWorker.onmessage = (e) => {
            const line = typeof e.data === 'string' ? e.data : '';
            if (!line) return;
            if (line === 'uciok') {
                for (const [name, value] of Object.entries(ENGINE_OPTIONS)) {
                    engineWorker.postMessage(`setoption name ${name} value ${value}`);
                }
                engineWorker.postMessage('ucinewgame');
                engineWorker.postMessage('isready');
                return;
            }
            if (line === 'readyok') {
                engineReady = true;
                log('Yuuki Engine ready');
                return;
            }
            if (line.startsWith('bestmove')) {
                const parts = line.split(/\s+/);
                const move = parts[1] && parts[1] !== '0000' ? parts[1] : null;
                if (pendingBestMove) {
                    const resolve = pendingBestMove;
                    pendingBestMove = null;
                    resolve(move);
                }
            }
        };
        engineWorker.onerror = (err) => {
            console.error('[Yuuki] Engine worker error', err);
            if (pendingBestMove) { pendingBestMove(null); pendingBestMove = null; }
        };
        engineWorker.postMessage('uci');
    } catch (err) {
        console.error('[Yuuki] Failed to initialize engine', err);
    }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function getBoard() {
    return document.querySelector('wc-chess-board') || document.querySelector('.board') || document.querySelector('chess-board');
}

function getSquareRect(square) {
    const board = getBoard();
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    const size = rect.width / 8;
    const isFlipped = board.classList.contains('flipped');
    const file = colToNum[square[0]];
    const rank = parseInt(square[1]);
    let x, y;
    if (isFlipped) {
        x = (8 - file) * size;
        y = (rank - 1) * size;
    } else {
        x = (file - 1) * size;
        y = (8 - rank) * size;
    }
    const jitter = () => (Math.random() - 0.5) * (size * 0.4);
    return {
        centerX: rect.left + x + size / 2 + jitter(),
        centerY: rect.top + y + size / 2 + jitter()
    };
}

function algToSquareClass(square) {
    return `square-${colToNum[square[0]]}${square[1]}`;
}

function getPieceElementOnSquare(sq) {
    const cls = algToSquareClass(sq);
    return document.querySelector(`.piece.${cls}`);
}

function isMyPieceOnSquare(sq) {
    const el = getPieceElementOnSquare(sq);
    if (!el) return false;
    const my = getMyColor();
    return el.classList.contains(`${my}p`) || el.classList.contains(`${my}n`) ||
           el.classList.contains(`${my}b`) || el.classList.contains(`${my}r`) ||
           el.classList.contains(`${my}q`) || el.classList.contains(`${my}k`);
}

function getMyColor() {
    const board = getBoard();
    if (!board) return 'w';
    return board.classList.contains('flipped') ? 'b' : 'w';
}

function getActiveColor() {
    let sideToMove = "w";
    const highlights = document.querySelectorAll('.highlight');
    for (let hl of highlights) {
        const hlClass = Array.from(hl.classList).find(c => c.startsWith('square-'));
        if (hlClass) {
            const squareNum = hlClass.split('-')[1];
            const piece = document.querySelector(`.piece.square-${squareNum}`);
            if (piece) {
                const pClasses = Array.from(piece.classList);
                if (pClasses.some(c => c.startsWith('w'))) { sideToMove = "b"; break; }
                else if (pClasses.some(c => c.startsWith('b'))) { sideToMove = "w"; break; }
            }
        }
    }
    return sideToMove;
}

function getFEN() {
    const pieces = document.querySelectorAll('.piece');
    if (pieces.length === 0) return null;
    let board = Array(8).fill(null).map(() => Array(8).fill(null));
    pieces.forEach(piece => {
        const classes = Array.from(piece.classList);
        const typeClass = classes.find(c => pieceToFen[c]);
        const squareClass = classes.find(c => c.startsWith('square-'));
        if (typeClass && squareClass) {
            const coords = squareClass.split('-')[1];
            board[8 - parseInt(coords[1])][parseInt(coords[0]) - 1] = pieceToFen[typeClass];
        }
    });
    let fenRows = [];
    for (let r = 0; r < 8; r++) {
        let empty = 0;
        let rowStr = "";
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === null) empty++;
            else {
                if (empty > 0) { rowStr += empty; empty = 0; }
                rowStr += board[r][c];
            }
        }
        if (empty > 0) rowStr += empty;
        fenRows.push(rowStr);
    }
    const side = getActiveColor();
    return fenRows.join('/') + ` ${side} - - 0 1`;
}

function fetchBestMove(fen) {
    return new Promise((resolve) => {
        if (!engineWorker || !engineReady) {
            log('Engine not ready yet');
            resolve(null);
            return;
        }
        if (pendingBestMove) {
            engineWorker.postMessage('stop');
            pendingBestMove(null);
            pendingBestMove = null;
        }
        pendingBestMove = resolve;
        engineWorker.postMessage(`position fen ${fen}`);
        engineWorker.postMessage(`go depth ${SEARCH_DEPTH}`);
    });
}

function dispatchPointer(type, elem, coords) {
    const evt = new PointerEvent(type, {
        bubbles: true, cancelable: true, view: window,
        clientX: coords.x, clientY: coords.y,
        buttons: 1, pointerId: 1, isPrimary: true,
        width: 1, height: 1, pressure: 0.5
    });
    elem.dispatchEvent(evt);
}

async function humanMouseMove(from, to) {
    const steps = Math.floor(Math.random() * 5) + 10;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const curve = Math.sin(t * Math.PI) * (Math.random() * 5);
        const curX = from.x + (to.x - from.x) * t + curve;
        const curY = from.y + (to.y - from.y) * t + curve;
        dispatchPointer('pointermove', document.body, { x: curX, y: curY });
        await sleep(Math.random() * 15 + 5);
    }
}

async function makeMove(move) {
    if (!move) return;
    const board = getBoard();
    if (!board) return;
    const fromSq = move.substring(0, 2);
    if (!isMyPieceOnSquare(fromSq)) return;
    const toSq = move.substring(2, 4);
    const isPromotion = move.length === 5;
    const fromRect = getSquareRect(fromSq);
    const toRect = getSquareRect(toSq);
    if (!fromRect || !toRect) return;
    const startCoords = { x: fromRect.centerX, y: fromRect.centerY };
    const endCoords = { x: toRect.centerX, y: toRect.centerY };
    let targetEl = document.elementFromPoint(startCoords.x, startCoords.y) || board;
    dispatchPointer('pointerdown', targetEl, startCoords);
    await sleep(Math.random() * 100 + 50);
    await humanMouseMove(startCoords, endCoords);
    dispatchPointer('pointerup', document.body, endCoords);
    if (isPromotion) await handlePromotion(move[4]);
}

async function handlePromotion(piece) {
    const deadline = Date.now() + 2500;
    let promotionWindow = null;
    while (Date.now() < deadline) {
        promotionWindow = document.querySelector('.promotion-window');
        if (promotionWindow) break;
        await sleep(100);
    }
    if (!promotionWindow) return;
    await sleep(Math.random() * 300 + 200);
    const p = piece.toLowerCase();
    const myColor = getMyColor();
    const btn = promotionWindow.querySelector(`.promotion-piece.${myColor}${p}`) || promotionWindow.querySelectorAll('.promotion-piece')[2];
    if (btn) {
        btn.click();
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
}

let isProcessing = false;
let lastProcessedFen = "";
let nextGameTimerId = null;
let hasClickedNextGame = false; // <── FLAG TO PREVENT SPAM CLICKING

// ── Auto Next Game Logic (SAFE MODE & NO SPAM) ────────────────────────────────
function startNextGameWatcher() {
    if (nextGameTimerId) clearWorkerInterval(nextGameTimerId);
    hasClickedNextGame = false; // Reset flag when watcher starts
    
    // Uses the background worker to prevent main-thread throttling
    nextGameTimerId = setWorkerInterval(() => {
        if (!window.chessHelper?.autoNextGame) {
            clearWorkerInterval(nextGameTimerId);
            nextGameTimerId = null;
            return;
        }
        
        const gameOverModal = document.querySelector(
            '.game-over-modal, .game-over-modal-content, .game-result-component, .board-modal-component'
        );
        
        if (gameOverModal) {
            // ONLY CLICK IF WE HAVEN'T ALREADY CLICKED FOR THIS MODAL
            if (!hasClickedNextGame) {
                const button = gameOverModal.querySelector('button.cc-button-component.cc-button-secondary') || 
                               gameOverModal.querySelector('button.cc-button-component');
                
                if (button && button.offsetParent !== null) {
                    button.click();
                    hasClickedNextGame = true; // Mark as clicked
                    log("Next game button clicked once!");
                }
            }
        } else {
            // Modal is gone (new game started), reset the flag
            hasClickedNextGame = false; 
        }
    }, 500);
}

async function checkTurnAndPlay() {
    if (!window.chessHelper?.autoPlay || isProcessing) return;
    const fen = getFEN();
    if (!fen || fen.split(' ')[1] !== getMyColor() || fen === lastProcessedFen) return;
    
    isProcessing = true;
    lastProcessedFen = fen;
    try {
        const thinkingTime = Math.floor(Math.random() * 2000) + 800;
        await sleep(thinkingTime);
        if (getFEN() === fen && window.chessHelper.autoPlay) {
            const move = await fetchBestMove(fen);
            if (move && getFEN() === fen) await makeMove(move);
        }
    } catch (e) {
        console.error(e);
        lastProcessedFen = "";
    } finally {
        isProcessing = false;
    }
}

const observer = new MutationObserver(() => {
    if (window.chessHelper?.autoPlay) checkTurnAndPlay();
});

function initObserver() {
    const board = getBoard();
    if (board) observer.observe(board, { childList: true, subtree: true, attributes: true });
    else setTimeout(initObserver, 1000);
}

initEngine();
initObserver();

// Uses the background worker to prevent main-thread throttling
setWorkerInterval(() => { 
    if (window.chessHelper?.autoPlay) checkTurnAndPlay(); 
}, 3000);

window.chessHelperEngine = {
    triggerAutoPlay: () => { isProcessing = false; lastProcessedFen = ""; checkTurnAndPlay(); },
    triggerAutoNext: () => { startNextGameWatcher(); },
    getFEN: getFEN,
    fetchBestMove: fetchBestMove,
    getMyColor: getMyColor()
};