var ENGINE_NAME = "Yuuki";
var ENGINE_VERSION = "1.0";
var ENGINE_AUTHOR = "Eryx";

var PIECE_NONE = 0;
var PIECE_PAWN = 1;
var PIECE_KNIGHT = 2;
var PIECE_BISHOP = 3;
var PIECE_ROOK = 4;
var PIECE_QUEEN = 5;
var PIECE_KING = 6;

var COLOR_WHITE = 0;
var COLOR_BLACK = 1;

var CASTLE_WK = 1;
var CASTLE_WQ = 2;
var CASTLE_BK = 4;
var CASTLE_BQ = 8;

var SQUARE_A1 = 0;
var SQUARE_B1 = 1;
var SQUARE_C1 = 2;
var SQUARE_D1 = 3;
var SQUARE_E1 = 4;
var SQUARE_F1 = 5;
var SQUARE_G1 = 6;
var SQUARE_H1 = 7;
var SQUARE_A2 = 16;
var SQUARE_B2 = 17;
var SQUARE_C2 = 18;
var SQUARE_D2 = 19;
var SQUARE_E2 = 20;
var SQUARE_F2 = 21;
var SQUARE_G2 = 22;
var SQUARE_H2 = 23;
var SQUARE_A3 = 32;
var SQUARE_B3 = 33;
var SQUARE_C3 = 34;
var SQUARE_D3 = 35;
var SQUARE_E3 = 36;
var SQUARE_F3 = 37;
var SQUARE_G3 = 38;
var SQUARE_H3 = 39;
var SQUARE_A4 = 48;
var SQUARE_B4 = 49;
var SQUARE_C4 = 50;
var SQUARE_D4 = 51;
var SQUARE_E4 = 52;
var SQUARE_F4 = 53;
var SQUARE_G4 = 54;
var SQUARE_H4 = 55;
var SQUARE_A5 = 64;
var SQUARE_B5 = 65;
var SQUARE_C5 = 66;
var SQUARE_D5 = 67;
var SQUARE_E5 = 68;
var SQUARE_F5 = 69;
var SQUARE_G5 = 70;
var SQUARE_H5 = 71;
var SQUARE_A6 = 80;
var SQUARE_B6 = 81;
var SQUARE_C6 = 82;
var SQUARE_D6 = 83;
var SQUARE_E6 = 84;
var SQUARE_F6 = 85;
var SQUARE_G6 = 86;
var SQUARE_H6 = 87;
var SQUARE_A7 = 96;
var SQUARE_B7 = 97;
var SQUARE_C7 = 98;
var SQUARE_D7 = 99;
var SQUARE_E7 = 100;
var SQUARE_F7 = 101;
var SQUARE_G7 = 102;
var SQUARE_H7 = 103;
var SQUARE_A8 = 112;
var SQUARE_B8 = 113;
var SQUARE_C8 = 114;
var SQUARE_D8 = 115;
var SQUARE_E8 = 116;
var SQUARE_F8 = 117;
var SQUARE_G8 = 118;
var SQUARE_H8 = 119;

var KNIGHT_DELTAS = [-33, -31, -18, -14, 14, 18, 31, 33];
var BISHOP_DELTAS = [-17, -15, 15, 17];
var ROOK_DELTAS = [-16, -1, 1, 16];
var QUEEN_DELTAS = [-17, -16, -15, -1, 1, 15, 16, 17];
var KING_DELTAS = [-17, -16, -15, -1, 1, 15, 16, 17];

var FLAG_NONE = 0;
var FLAG_ENPASSANT = 1;
var FLAG_CASTLING = 2;
var FLAG_PAWN_DOUBLE = 4;
var FLAG_PROMOTION = 8;

var VALUE_ZERO = 0;
var VALUE_PAWN = 100;
var VALUE_KNIGHT = 320;
var VALUE_BISHOP = 330;
var VALUE_ROOK = 500;
var VALUE_QUEEN = 950;
var VALUE_KING = 20000;
var VALUE_INFINITE = 999999;
var VALUE_MATE = 90000;
var VALUE_DRAW = 0;

var PHASE_PAWN = 0;
var PHASE_KNIGHT = 1;
var PHASE_BISHOP = 2;
var PHASE_ROOK = 3;
var PHASE_QUEEN = 4;

var GAME_PHASE_OPENING = 0;
var GAME_PHASE_MIDDLEGAME = 1;
var GAME_PHASE_ENDGAME = 2;

var TT_EXACT = 0;
var TT_ALPHA = 1;
var TT_BETA = 2;

var MAX_PLY = 128;
var MAX_MOVES = 256;

var SEARCH_NODE_REGULAR = 0;
var SEARCH_NODE_PV = 1;
var SEARCH_NODE_NULL = 2;

var LM_FLAG_NONE = 0;
var LM_FLAG_HASH = 1;
var LM_FLAG_KILLER_1 = 2;
var LM_FLAG_KILLER_2 = 3;
var LM_FLAG_COUNTER = 4;
var LM_FLAG_WINNING_CAPTURE = 5;
var LM_FLAG_EQUAL_CAPTURE = 6;
var LM_FLAG_LOSING_CAPTURE = 7;
var LM_FLAG_HISTORY = 8;

var INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var g_board = new Array(128);
var g_sideToMove = COLOR_WHITE;
var g_castlingRights = 0;
var g_enPassantSquare = -1;
var g_halfMoveClock = 0;
var g_fullMoveNumber = 1;
var g_phaseScore = 0;
var g_gamePhase = GAME_PHASE_OPENING;

var g_moveHistory = [];
var g_positionHistory = [];
var g_repetitionTable = [];

var g_pieceValues = {
    pawn: VALUE_PAWN,
    knight: VALUE_KNIGHT,
    bishop: VALUE_BISHOP,
    rook: VALUE_ROOK,
    queen: VALUE_QUEEN,
    king: VALUE_KING
};

var g_engineOptions = {
    hashSizeMB: 64,
    threads: 1,
    skillLevel: 20,
    contempt: 0,
    nullMoveReduction: 3,
    nullMoveDepthLimit: 3,
    lmrDepthThreshold: 3,
    lmrBaseReduction: 0.75,
    lmrMoveCountThreshold: 3,
    aspirationWindow: 25,
    aspirationWindowMinDepth: 4,
    futilityMargin: 100,
    futilityDepthLimit: 3,
    razorMargin: 300,
    razorDepthLimit: 2,
    singularExtensionMargin: 50,
    singularExtensionDepth: 6,
    kingSafetyWeight: 100,
    mobilityWeight: 8,
    pawnStructureWeight: 12,
    passedPawnWeight: 50,
    isolatedPawnPenalty: 15,
    doubledPawnPenalty: 10,
    backwardPawnPenalty: 12,
    bishopPairBonus: 30,
    rookOnOpenFile: 20,
    rookOnSemiOpenFile: 10,
    rookOnSeventhRank: 20,
    knightOutpostBonus: 15,
    knightOnRimPenalty: 5,
    tempoBonus: 10,
    spaceWeight: 2,
    threatWeight: 5,
    trappedPiecePenalty: 50,
    overextendedPawnPenalty: 8,
    pawnChainBonus: 8,
    centralPawnBonus: 15,
    advancedPawnBonus: 10,
    kingTropismWeight: 3,
    pawnShieldWeight: 20,
    pawnStormWeight: 15,
    attackZoneWeight: 10,
    queenEarlyDevelopmentPenalty: 10,
    rookCoordinationBonus: 5,
    minorBehindPawnBonus: 5,
    badBishopPenalty: 8,
    pinnedPiecePenalty: 10,
    discoveryThreatBonus: 15,
    materialImbalanceWeight: 5,
    initiativeWeight: 5,
    drawScore: 0,
    verboseUCI: false,
    ponderEnabled: false,
    multipv: 1,
    slowMover: 100,
    moveOverhead: 30,
    minimumThinkingTime: 20,
    emergencyTimeBuffer: 60,
    slowMoverMin: 10,
    slowMoverMax: 1000,
    contemptDrawScore: 10,
    analyzeMode: false,
    showCurrentLine: false,
    syzygyPath: "",
    syzygyProbeDepth: 1,
    syzygyProbeLimit: 6,
    cleanSearch: true,
    pruneAtRoot: false,
    selectiveDepth: 64
};

var g_currentPV = [];
var g_currentScore = 0;
var g_currentDepth = 0;
var g_selDepth = 0;
var g_searchStartTime = 0;
var g_searchNodes = 0;
var g_stopSearch = false;
var g_isSearching = false;
var g_isPondering = false;
var g_ponderHit = false;
var g_debugMode = false;
var g_lastBestMove = null;

var g_killerMoves = [];
for (var i = 0; i < MAX_PLY; i++) {
    g_killerMoves[i] = [{from: 0, to: 0}, {from: 0, to: 0}];
}

var g_historyTable = [{}, {}];
var g_counterMoves = [{}, {}];
var g_counterMoveHistory = [{}, {}];

var g_transpositionTable = {};
var g_ttSize = 0;

var g_zobristKeys = [];
var g_zobristSide;
var g_zobristCastling = [0, 0, 0, 0];
var g_zobristEnPassant = new Array(128);

var g_pawnHashTable = {};

var g_evalCache = {};

var g_pieceToChar = ".pnbrqk";
var g_charToPiece = {p: PIECE_PAWN, n: PIECE_KNIGHT, b: PIECE_BISHOP, r: PIECE_ROOK, q: PIECE_QUEEN, k: PIECE_KING};

var PST_MG_PAWN = [
    // FIXED: Reversed so higher ranks (closer to promotion) have higher values
     0,   0,   0,   0,   0,   0,   0,   0,
     5,  10,  10, -20, -20,  10,  10,   5,
     5,  -5, -10,   0,   0, -10,  -5,   5,
     0,   0,   0,  20,  20,   0,   0,   0,
     5,   5,  10,  25,  25,  10,   5,   5,
    10,  10,  20,  30,  30,  20,  10,  10,
    50,  50,  50,  50,  50,  50,  50,  50,
     0,   0,   0,   0,   0,   0,   0,   0
];

var PST_EG_PAWN = [
    // FIXED: Reversed so higher ranks have higher values (pawns closer to promotion = better)
     0,   0,   0,   0,   0,   0,   0,   0,
     0,   0,   0,   0,   0,   0,   0,   0,
    10,  10,  10,  10,  10,  10,  10,  10,
    20,  20,  20,  20,  20,  20,  20,  20,
    30,  30,  30,  30,  30,  30,  30,  30,
    50,  50,  50,  50,  50,  50,  50,  50,
    80,  80,  80,  80,  80,  80,  80,  80,
     0,   0,   0,   0,   0,   0,   0,   0
];

var PST_MG_KNIGHT = [
   -50, -40, -30, -30, -30, -30, -40, -50,
   -40, -20,   0,   0,   0,   0, -20, -40,
   -30,   0,  10,  15,  15,  10,   0, -30,
   -30,   5,  15,  20,  20,  15,   5, -30,
   -30,   0,  15,  20,  20,  15,   0, -30,
   -30,   5,  10,  15,  15,  10,   5, -30,
   -40, -20,   0,   5,   5,   0, -20, -40,
   -50, -40, -30, -30, -30, -30, -40, -50
];

var PST_EG_KNIGHT = [
   -50, -40, -30, -30, -30, -30, -40, -50,
   -40, -20,   0,   0,   0,   0, -20, -40,
   -30,   0,  10,  15,  15,  10,   0, -30,
   -30,   5,  15,  20,  20,  15,   5, -30,
   -30,   0,  15,  20,  20,  15,   0, -30,
   -30,   5,  10,  15,  15,  10,   5, -30,
   -40, -20,   0,   5,   5,   0, -20, -40,
   -50, -40, -30, -30, -30, -30, -40, -50
];

var PST_MG_BISHOP = [
   -20, -10, -10, -10, -10, -10, -10, -20,
   -10,   0,   0,   0,   0,   0,   0, -10,
   -10,   0,   5,  10,  10,   5,   0, -10,
   -10,   5,   5,  10,  10,   5,   5, -10,
   -10,   0,  10,  10,  10,  10,   0, -10,
   -10,  10,  10,  10,  10,  10,  10, -10,
   -10,   5,   0,   0,   0,   0,   5, -10,
   -20, -10, -10, -10, -10, -10, -10, -20
];

var PST_EG_BISHOP = [
   -20, -10, -10, -10, -10, -10, -10, -20,
   -10,   0,   0,   0,   0,   0,   0, -10,
   -10,   0,  10,  10,  10,  10,   0, -10,
   -10,  10,  10,  10,  10,  10,  10, -10,
   -10,   0,  10,  10,  10,  10,   0, -10,
   -10,  10,  10,  10,  10,  10,  10, -10,
   -10,   5,   0,   0,   0,   0,   5, -10,
   -20, -10, -10, -10, -10, -10, -10, -20
];

var PST_MG_ROOK = [
     0,   0,   0,   0,   0,   0,   0,   0,
     5,  10,  10,  10,  10,  10,  10,   5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
     0,   0,   0,   5,   5,   0,   0,   0
];

var PST_EG_ROOK = [
     0,   0,   0,   0,   0,   0,   0,   0,
     5,  10,  10,  10,  10,  10,  10,   5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
     0,   0,   0,   5,   5,   0,   0,   0
];

var PST_MG_QUEEN = [
   -20, -10, -10,  -5,  -5, -10, -10, -20,
   -10,   0,   0,   0,   0,   0,   0, -10,
   -10,   0,   5,   5,   5,   5,   0, -10,
    -5,   0,   5,   5,   5,   5,   0,  -5,
     0,   0,   5,   5,   5,   5,   0,  -5,
   -10,   5,   5,   5,   5,   5,   0, -10,
   -10,   0,   5,   0,   0,   0,   0, -10,
   -20, -10, -10,  -5,  -5, -10, -10, -20
];

var PST_EG_QUEEN = [
   -20, -10, -10,  -5,  -5, -10, -10, -20,
   -10,   0,   0,   0,   0,   0,   0, -10,
   -10,   0,   5,   5,   5,   5,   0, -10,
    -5,   0,   5,   5,   5,   5,   0,  -5,
     0,   0,   5,   5,   5,   5,   0,  -5,
   -10,   5,   5,   5,   5,   5,   0, -10,
   -10,   0,   5,   0,   0,   0,   0, -10,
   -20, -10, -10,  -5,  -5, -10, -10, -20
];

var PST_MG_KING = [
   -30, -40, -40, -50, -50, -40, -40, -30,
   -30, -40, -40, -50, -50, -40, -40, -30,
   -30, -40, -40, -50, -50, -40, -40, -30,
   -30, -40, -40, -50, -50, -40, -40, -30,
   -20, -30, -30, -40, -40, -30, -30, -20,
   -10, -20, -20, -20, -20, -20, -20, -10,
    20,  20,   0,   0,   0,   0,  20,  20,
    20,  30,  10,   0,   0,  10,  30,  20
];

var PST_EG_KING = [
   -50, -40, -30, -20, -20, -30, -40, -50,
   -30, -20, -10,   0,   0, -10, -20, -30,
   -30, -10,  20,  30,  30,  20, -10, -30,
   -30, -10,  30,  40,  40,  30, -10, -30,
   -30, -10,  30,  40,  40,  30, -10, -30,
   -30, -10,  20,  30,  30,  20, -10, -30,
   -30, -30,   0,   0,   0,   0, -30, -30,
   -50, -30, -30, -30, -30, -30, -30, -50
];

var PIECE_PHASE_VALUE = [0, 0, 1, 1, 2, 4, 0];

var MOBILITY_BONUS_KNIGHT = [-20, -10, 0, 5, 10, 15, 20, 25, 30];
var MOBILITY_BONUS_BISHOP = [-15, -5, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
var MOBILITY_BONUS_ROOK = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
var MOBILITY_BONUS_QUEEN = [-20, -10, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125];

var PASSED_PAWN_BONUS_MG = [0, 10, 20, 40, 60, 90, 140, 0];
var PASSED_PAWN_BONUS_EG = [0, 20, 40, 60, 90, 140, 200, 0];
var CONNECTED_PASSED_PAWN_BONUS = [0, 5, 10, 20, 30, 50, 80, 0];
var CANDIDATE_PASSED_PAWN_BONUS = [0, 5, 10, 15, 25, 40, 60, 0];

var KING_ATTACK_WEIGHTS = [0, 0, 2, 2, 3, 4, 0];
var KING_SAFETY_ATTACK_VALUE = [0, 0, 20, 40, 60, 90, 130, 180, 250, 350, 500];
var KING_SAFETY_WEAK_SQUARES = [0, 0, 5, 15, 30, 55, 90, 140, 200, 300, 450];

var THREAT_BY_MINOR = [0, 10, 30, 30, 50, 80, 0];
var THREAT_BY_ROOK = [0, 10, 20, 20, 30, 40, 0];
var THREAT_BY_QUEEN = [0, 5, 10, 10, 15, 20, 0];
var THREAT_BY_KING = [0, 5, 10, 10, 15, 20, 0];
var HANGING_PIECE_PENALTY = [0, 15, 25, 25, 35, 45, 0];
var TRAPPED_PIECE_PENALTY = [0, 20, 40, 40, 60, 80, 0];

var CENTER_SQUARES = [SQUARE_D4, SQUARE_E4, SQUARE_D5, SQUARE_E5];
var EXTENDED_CENTER = [
    SQUARE_C3, SQUARE_D3, SQUARE_E3, SQUARE_F3,
    SQUARE_C4, SQUARE_D4, SQUARE_E4, SQUARE_F4,
    SQUARE_C5, SQUARE_D5, SQUARE_E5, SQUARE_F5,
    SQUARE_C6, SQUARE_D6, SQUARE_E6, SQUARE_F6
];

var MATERIAL_IMBALANCE_TABLE = [
    [0], [-10], [-10, 5], [-20, 10, 0], [-30, 15, 5, 0], [-50, 25, 10, 5, 0]
];

var SEE_PIECE_VALUES = [0, 100, 320, 330, 500, 950, 20000];

var LMR_REDUCTION_TABLE = [];
for (var i = 0; i < 64; i++) {
    LMR_REDUCTION_TABLE[i] = [];
    for (var j = 0; j < 64; j++) {
        LMR_REDUCTION_TABLE[i][j] = 0;
    }
}
for (var depth = 1; depth < 64; depth++) {
    for (var moveCount = 1; moveCount < 64; moveCount++) {
        var reduction = Math.floor(0.75 + Math.log(depth) * Math.log(moveCount) / 2.25);
        if (reduction < 0) reduction = 0;
        if (reduction > depth - 1) reduction = depth - 1;
        LMR_REDUCTION_TABLE[depth][moveCount] = reduction;
    }
}

var FUTILITY_MARGIN_TABLE = [0, 100, 200, 350];
var RAZOR_MARGIN_TABLE = [0, 300, 450];

var g_openingBook = {};
var g_useOpeningBook = false;
var g_bookMoves = [];

var g_searchStats = {
    nodes: 0,
    qnodes: 0,
    tthits: 0,
    ttcuts: 0,
    nullCuts: 0,
    lmrReductions: 0,
    futilityPrunes: 0,
    razorPrunes: 0,
    extensions: 0,
    checkExtensions: 0,
    singularExtensions: 0,
    aspirationResearches: 0,
    nps: 0
};

var g_searchStack = [];
for (var i = 0; i < MAX_PLY; i++) {
    g_searchStack[i] = {
        pv: [],
        staticEval: 0,
        killers: [{from: 0, to: 0}, {from: 0, to: 0}],
        currentMove: null,
        excludedMove: null,
        inCheck: false,
        moveCount: 0
    };
}

var g_bestMoveChanges = 0;
var g_previousBestMove = null;
var g_stableBestMoveCount = 0;

function sendUCI(msg) {
    self.postMessage(msg);
}

function sendInfoString(str) {
    sendUCI("info string " + str);
}

function sendBestMove(move, ponder) {
    if (move) {
        var msg = "bestmove " + move;
        if (ponder && g_engineOptions.ponderEnabled) {
            msg += " ponder " + ponder;
        }
        sendUCI(msg);
    } else {
        sendUCI("bestmove 0000");
    }
}

function sendCopyProtection(status) {
    sendUCI("copyprotection " + status);
}

function sendRegistration(status) {
    sendUCI("registration " + status);
}

function sendInfo(infoStr) {
    sendUCI("info " + infoStr);
}

function sendID() {
    sendUCI("id name " + ENGINE_NAME + " " + ENGINE_VERSION);
    sendUCI("id author " + ENGINE_AUTHOR);
}

function sendUCIOptions() {
    sendUCI("option name Hash type spin default 64 min 1 max 4096");
    sendUCI("option name Clear Hash type button");
    sendUCI("option name Ponder type check default false");
    sendUCI("option name MultiPV type spin default 1 min 1 max 500");
    sendUCI("option name Skill Level type spin default 20 min 0 max 20");
    sendUCI("option name Move Overhead type spin default 30 min 0 max 5000");
    sendUCI("option name Minimum Thinking Time type spin default 20 min 0 max 5000");
    sendUCI("option name Slow Mover type spin default 100 min 10 max 1000");
    sendUCI("option name Threads type spin default 1 min 1 max 512");
    sendUCI("option name UCI_AnalyseMode type check default false");
    sendUCI("option name UCI_LimitStrength type check default false");
    sendUCI("option name UCI_Elo type spin default 3200 min 500 max 3200");
    sendUCI("option name UCI_ShowCurrLine type check default false");
    sendUCI("option name Contempt type spin default 0 min -100 max 100");
    sendUCI("option name Analysis Contempt type combo default Both var Off var White var Black var Both");
    sendUCI("option name PawnValue type spin default 100 min 0 max 2000");
    sendUCI("option name KnightValue type spin default 320 min 0 max 2000");
    sendUCI("option name BishopValue type spin default 330 min 0 max 2000");
    sendUCI("option name RookValue type spin default 500 min 0 max 2000");
    sendUCI("option name QueenValue type spin default 950 min 0 max 4000");
    sendUCI("option name KingValue type spin default 20000 min 0 max 100000");
    sendUCI("option name NullMoveReduction type spin default 3 min 1 max 10");
    sendUCI("option name NullMoveDepthLimit type spin default 3 min 1 max 20");
    sendUCI("option name LMRDepthThreshold type spin default 3 min 1 max 20");
    sendUCI("option name LMRBaseReduction type spin default 75 min 0 max 200");
    sendUCI("option name LMRMoveCountThreshold type spin default 3 min 1 max 20");
    sendUCI("option name AspirationWindow type spin default 25 min 1 max 500");
    sendUCI("option name AspirationWindowMinDepth type spin default 4 min 1 max 20");
    sendUCI("option name FutilityMargin type spin default 100 min 0 min 0 max 1000");
    sendUCI("option name FutilityDepthLimit type spin default 3 min 0 max 10");
    sendUCI("option name RazorMargin type spin default 300 min 0 max 1000");
    sendUCI("option name RazorDepthLimit type spin default 2 min 0 max 10");
    sendUCI("option name SingularExtensionMargin type spin default 50 min 0 max 500");
    sendUCI("option name SingularExtensionDepth type spin default 6 min 1 max 20");
    sendUCI("option name KingSafetyWeight type spin default 100 min 0 max 500");
    sendUCI("option name MobilityWeight type spin default 8 min 0 max 100");
    sendUCI("option name PawnStructureWeight type spin default 12 min 0 max 200");
    sendUCI("option name PassedPawnWeight type spin default 50 min 0 max 200");
    sendUCI("option name IsolatedPawnPenalty type spin default 15 min 0 max 100");
    sendUCI("option name DoubledPawnPenalty type spin default 10 min 0 max 100");
    sendUCI("option name BackwardPawnPenalty type spin default 12 min 0 max 100");
    sendUCI("option name BishopPairBonus type spin default 30 min 0 max 100");
    sendUCI("option name RookOnOpenFile type spin default 20 min 0 max 100");
    sendUCI("option name RookOnSemiOpenFile type spin default 10 min 0 max 100");
    sendUCI("option name RookOnSeventhRank type spin default 20 min 0 max 100");
    sendUCI("option name KnightOutpostBonus type spin default 15 min 0 max 100");
    sendUCI("option name KnightOnRimPenalty type spin default 5 min 0 max 50");
    sendUCI("option name TempoBonus type spin default 10 min 0 max 100");
    sendUCI("option name SpaceWeight type spin default 2 min 0 max 50");
    sendUCI("option name ThreatWeight type spin default 5 min 0 max 50");
    sendUCI("option name TrappedPiecePenalty type spin default 50 min 0 max 200");
    sendUCI("option name OverextendedPawnPenalty type spin default 8 min 0 max 50");
    sendUCI("option name PawnChainBonus type spin default 8 min 0 max 50");
    sendUCI("option name CentralPawnBonus type spin default 15 min 0 max 100");
    sendUCI("option name AdvancedPawnBonus type spin default 10 min 0 max 100");
    sendUCI("option name KingTropismWeight type spin default 3 min 0 max 30");
    sendUCI("option name PawnShieldWeight type spin default 20 min 0 max 100");
    sendUCI("option name PawnStormWeight type spin default 15 min 0 max 100");
    sendUCI("option name AttackZoneWeight type spin default 10 min 0 max 100");
    sendUCI("option name QueenEarlyDevelopmentPenalty type spin default 10 min 0 max 100");
    sendUCI("option name RookCoordinationBonus type spin default 5 min 0 max 50");
    sendUCI("option name MinorBehindPawnBonus type spin default 5 min 0 max 50");
    sendUCI("option name BadBishopPenalty type spin default 8 min 0 max 50");
    sendUCI("option name PinnedPiecePenalty type spin default 10 min 0 max 100");
    sendUCI("option name DiscoveryThreatBonus type spin default 15 min 0 max 100");
    sendUCI("option name MaterialImbalanceWeight type spin default 5 min 0 max 50");
    sendUCI("option name InitiativeWeight type spin default 5 min 0 max 50");
    sendUCI("option name DrawScore type spin default 0 min -100 max 100");
    sendUCI("option name VerboseUCI type check default false");
    sendUCI("option name OwnBook type check default false");
    sendUCI("option name BookFile type string default");
    sendUCI("option name BestBookMove type check default false");
    sendUCI("option name Clean Search type check default true");
    sendUCI("option name SelectiveDepth type spin default 64 min 1 max 128");
    sendUCI("uciok");
}

self.onmessage = function(e) {
    var cmd = e.data.trim();
    var tokens = cmd.split(/\s+/);
    var command = tokens[0];

    switch (command) {
        case "uci":
            sendID();
            sendUCIOptions();
            break;
        case "isready":
            sendUCI("readyok");
            break;
        case "ucinewgame":
            handleNewGame();
            break;
        case "setoption":
            handleSetOption(tokens);
            break;
        case "position":
            handlePosition(cmd);
            break;
        case "go":
            handleGo(cmd);
            break;
        case "stop":
            g_stopSearch = true;
            g_isPondering = false;
            break;
        case "quit":
            g_stopSearch = true;
            close();
            break;
        case "ponderhit":
            handlePonderHit();
            break;
        case "debug":
            g_debugMode = tokens[1] === "on";
            break;
        case "d":
            printBoard();
            break;
        case "eval":
            var ev = evaluateFull();
            sendInfoString("Evaluation: " + ev + " cp (side to move)");
            break;
        case "perft":
            var perftDepth = parseInt(tokens[1]) || 6;
            runPerft(perftDepth);
            break;
        case "divide":
            var divDepth = parseInt(tokens[1]) || 6;
            runDivide(divDepth);
            break;
    }
};

function handleNewGame() {
    resetSearchState();
    initializeBoard();
    initZobrist();
    clearTranspositionTable();
    clearEvaluationCache();
    clearPawnHashTable();
    g_positionHistory = [];
    g_repetitionTable = [];
    g_lastBestMove = null;
    g_previousBestMove = null;
    g_bestMoveChanges = 0;
    g_stableBestMoveCount = 0;
}

function handleSetOption(tokens) {
    var name = "";
    var value = "";
    var foundValue = false;

    for (var i = 1; i < tokens.length; i++) {
        if (tokens[i] === "name") {
            i++;
            while (i < tokens.length && tokens[i] !== "value") {
                name += (name ? " " : "") + tokens[i];
                i++;
            }
            i--;
        } else if (tokens[i] === "value") {
            foundValue = true;
            i++;
            while (i < tokens.length) {
                value += (value ? " " : "") + tokens[i];
                i++;
            }
        }
    }

    if (!foundValue && name !== "Clear Hash") return;

    switch (name) {
        case "Hash":
            g_engineOptions.hashSizeMB = parseInt(value) || 64;
            resizeTranspositionTable();
            break;
        case "Clear Hash":
            clearTranspositionTable();
            break;
        case "Ponder":
            g_engineOptions.ponderEnabled = value === "true";
            break;
        case "MultiPV":
            g_engineOptions.multipv = parseInt(value) || 1;
            break;
        case "Skill Level":
            g_engineOptions.skillLevel = parseInt(value) || 20;
            if (g_engineOptions.skillLevel < 0) g_engineOptions.skillLevel = 0;
            if (g_engineOptions.skillLevel > 20) g_engineOptions.skillLevel = 20;
            break;
        case "Move Overhead":
            g_engineOptions.moveOverhead = parseInt(value) || 30;
            break;
        case "Minimum Thinking Time":
            g_engineOptions.minimumThinkingTime = parseInt(value) || 20;
            break;
        case "Slow Mover":
            g_engineOptions.slowMover = parseInt(value) || 100;
            break;
        case "Threads":
            g_engineOptions.threads = parseInt(value) || 1;
            break;
        case "UCI_AnalyseMode":
            g_engineOptions.analyzeMode = value === "true";
            break;
        case "UCI_LimitStrength":
            break;
        case "UCI_Elo":
            break;
        case "UCI_ShowCurrLine":
            g_engineOptions.showCurrentLine = value === "true";
            break;
        case "Contempt":
            g_engineOptions.contempt = parseInt(value) || 0;
            break;
        case "Analysis Contempt":
            break;
        case "PawnValue":
            g_pieceValues.pawn = parseInt(value) || VALUE_PAWN;
            clearEvaluationCache();
            break;
        case "KnightValue":
            g_pieceValues.knight = parseInt(value) || VALUE_KNIGHT;
            clearEvaluationCache();
            break;
        case "BishopValue":
            g_pieceValues.bishop = parseInt(value) || VALUE_BISHOP;
            clearEvaluationCache();
            break;
        case "RookValue":
            g_pieceValues.rook = parseInt(value) || VALUE_ROOK;
            clearEvaluationCache();
            break;
        case "QueenValue":
            g_pieceValues.queen = parseInt(value) || VALUE_QUEEN;
            clearEvaluationCache();
            break;
        case "KingValue":
            g_pieceValues.king = parseInt(value) || VALUE_KING;
            clearEvaluationCache();
            break;
        case "NullMoveReduction":
            g_engineOptions.nullMoveReduction = parseInt(value) || 3;
            break;
        case "NullMoveDepthLimit":
            g_engineOptions.nullMoveDepthLimit = parseInt(value) || 3;
            break;
        case "LMRDepthThreshold":
            g_engineOptions.lmrDepthThreshold = parseInt(value) || 3;
            break;
        case "LMRBaseReduction":
            g_engineOptions.lmrBaseReduction = parseInt(value) / 100 || 0.75;
            buildLMRTable();
            break;
        case "LMRMoveCountThreshold":
            g_engineOptions.lmrMoveCountThreshold = parseInt(value) || 3;
            break;
        case "AspirationWindow":
            g_engineOptions.aspirationWindow = parseInt(value) || 25;
            break;
        case "AspirationWindowMinDepth":
            g_engineOptions.aspirationWindowMinDepth = parseInt(value) || 4;
            break;
        case "FutilityMargin":
            g_engineOptions.futilityMargin = parseInt(value) || 100;
            buildFutilityMargins();
            break;
        case "FutilityDepthLimit":
            g_engineOptions.futilityDepthLimit = parseInt(value) || 3;
            break;
        case "RazorMargin":
            g_engineOptions.razorMargin = parseInt(value) || 300;
            buildRazorMargins();
            break;
        case "RazorDepthLimit":
            g_engineOptions.razorDepthLimit = parseInt(value) || 2;
            break;
        case "SingularExtensionMargin":
            g_engineOptions.singularExtensionMargin = parseInt(value) || 50;
            break;
        case "SingularExtensionDepth":
            g_engineOptions.singularExtensionDepth = parseInt(value) || 6;
            break;
        case "KingSafetyWeight":
            g_engineOptions.kingSafetyWeight = parseInt(value) || 100;
            clearEvaluationCache();
            break;
        case "MobilityWeight":
            g_engineOptions.mobilityWeight = parseInt(value) || 8;
            clearEvaluationCache();
            break;
        case "PawnStructureWeight":
            g_engineOptions.pawnStructureWeight = parseInt(value) || 12;
            clearEvaluationCache();
            break;
        case "PassedPawnWeight":
            g_engineOptions.passedPawnWeight = parseInt(value) || 50;
            clearEvaluationCache();
            break;
        case "IsolatedPawnPenalty":
            g_engineOptions.isolatedPawnPenalty = parseInt(value) || 15;
            clearEvaluationCache();
            break;
        case "DoubledPawnPenalty":
            g_engineOptions.doubledPawnPenalty = parseInt(value) || 10;
            clearEvaluationCache();
            break;
        case "BackwardPawnPenalty":
            g_engineOptions.backwardPawnPenalty = parseInt(value) || 12;
            clearEvaluationCache();
            break;
        case "BishopPairBonus":
            g_engineOptions.bishopPairBonus = parseInt(value) || 30;
            clearEvaluationCache();
            break;
        case "RookOnOpenFile":
            g_engineOptions.rookOnOpenFile = parseInt(value) || 20;
            clearEvaluationCache();
            break;
        case "RookOnSemiOpenFile":
            g_engineOptions.rookOnSemiOpenFile = parseInt(value) || 10;
            clearEvaluationCache();
            break;
        case "RookOnSeventhRank":
            g_engineOptions.rookOnSeventhRank = parseInt(value) || 20;
            clearEvaluationCache();
            break;
        case "KnightOutpostBonus":
            g_engineOptions.knightOutpostBonus = parseInt(value) || 15;
            clearEvaluationCache();
            break;
        case "KnightOnRimPenalty":
            g_engineOptions.knightOnRimPenalty = parseInt(value) || 5;
            clearEvaluationCache();
            break;
        case "TempoBonus":
            g_engineOptions.tempoBonus = parseInt(value) || 10;
            clearEvaluationCache();
            break;
        case "SpaceWeight":
            g_engineOptions.spaceWeight = parseInt(value) || 2;
            clearEvaluationCache();
            break;
        case "ThreatWeight":
            g_engineOptions.threatWeight = parseInt(value) || 5;
            clearEvaluationCache();
            break;
        case "TrappedPiecePenalty":
            g_engineOptions.trappedPiecePenalty = parseInt(value) || 50;
            clearEvaluationCache();
            break;
        case "OverextendedPawnPenalty":
            g_engineOptions.overextendedPawnPenalty = parseInt(value) || 8;
            clearEvaluationCache();
            break;
        case "PawnChainBonus":
            g_engineOptions.pawnChainBonus = parseInt(value) || 8;
            clearEvaluationCache();
            break;
        case "CentralPawnBonus":
            g_engineOptions.centralPawnBonus = parseInt(value) || 15;
            clearEvaluationCache();
            break;
        case "AdvancedPawnBonus":
            g_engineOptions.advancedPawnBonus = parseInt(value) || 10;
            clearEvaluationCache();
            break;
        case "KingTropismWeight":
            g_engineOptions.kingTropismWeight = parseInt(value) || 3;
            clearEvaluationCache();
            break;
        case "PawnShieldWeight":
            g_engineOptions.pawnShieldWeight = parseInt(value) || 20;
            clearEvaluationCache();
            break;
        case "PawnStormWeight":
            g_engineOptions.pawnStormWeight = parseInt(value) || 15;
            clearEvaluationCache();
            break;
        case "AttackZoneWeight":
            g_engineOptions.attackZoneWeight = parseInt(value) || 10;
            clearEvaluationCache();
            break;
        case "QueenEarlyDevelopmentPenalty":
            g_engineOptions.queenEarlyDevelopmentPenalty = parseInt(value) || 10;
            clearEvaluationCache();
            break;
        case "RookCoordinationBonus":
            g_engineOptions.rookCoordinationBonus = parseInt(value) || 5;
            clearEvaluationCache();
            break;
        case "MinorBehindPawnBonus":
            g_engineOptions.minorBehindPawnBonus = parseInt(value) || 5;
            clearEvaluationCache();
            break;
        case "BadBishopPenalty":
            g_engineOptions.badBishopPenalty = parseInt(value) || 8;
            clearEvaluationCache();
            break;
        case "PinnedPiecePenalty":
            g_engineOptions.pinnedPiecePenalty = parseInt(value) || 10;
            clearEvaluationCache();
            break;
        case "DiscoveryThreatBonus":
            g_engineOptions.discoveryThreatBonus = parseInt(value) || 15;
            clearEvaluationCache();
            break;
        case "MaterialImbalanceWeight":
            g_engineOptions.materialImbalanceWeight = parseInt(value) || 5;
            clearEvaluationCache();
            break;
        case "InitiativeWeight":
            g_engineOptions.initiativeWeight = parseInt(value) || 5;
            clearEvaluationCache();
            break;
        case "DrawScore":
            g_engineOptions.drawScore = parseInt(value) || 0;
            break;
        case "VerboseUCI":
            g_engineOptions.verboseUCI = value === "true";
            break;
        case "OwnBook":
            g_useOpeningBook = value === "true";
            break;
        case "BookFile":
            break;
        case "BestBookMove":
            break;
        case "Clean Search":
            g_engineOptions.cleanSearch = value === "true";
            break;
        case "SelectiveDepth":
            g_engineOptions.selectiveDepth = parseInt(value) || 64;
            break;
    }

    if (g_debugMode) {
        sendInfoString("Set " + name + " to " + value);
    }
}

function buildLMRTable() {
    var base = g_engineOptions.lmrBaseReduction;
    for (var depth = 1; depth < 64; depth++) {
        for (var moveCount = 1; moveCount < 64; moveCount++) {
            var reduction = Math.floor(base + Math.log(depth) * Math.log(moveCount) / 2.25);
            if (reduction < 0) reduction = 0;
            if (reduction > depth - 1) reduction = depth - 1;
            LMR_REDUCTION_TABLE[depth][moveCount] = reduction;
        }
    }
}

function buildFutilityMargins() {
    var base = g_engineOptions.futilityMargin;
    FUTILITY_MARGIN_TABLE[0] = 0;
    for (var i = 1; i < 10; i++) {
        FUTILITY_MARGIN_TABLE[i] = base * i;
    }
}

function buildRazorMargins() {
    var base = g_engineOptions.razorMargin;
    RAZOR_MARGIN_TABLE[0] = 0;
    RAZOR_MARGIN_TABLE[1] = base;
    RAZOR_MARGIN_TABLE[2] = base + 150;
    RAZOR_MARGIN_TABLE[3] = base + 300;
}

function resetSearchState() {
    g_transpositionTable = {};
    g_evalCache = {};
    g_pawnHashTable = {};
    g_historyTable = [{}, {}];
    g_counterMoves = [{}, {}];
    g_counterMoveHistory = [{}, {}];
    g_killerMoves = [];
    for (var i = 0; i < MAX_PLY; i++) {
        g_killerMoves[i] = [{from: 0, to: 0}, {from: 0, to: 0}];
    }
    g_searchStack = [];
    for (var i = 0; i < MAX_PLY; i++) {
        g_searchStack[i] = {
            pv: [],
            staticEval: 0,
            killers: [{from: 0, to: 0}, {from: 0, to: 0}],
            currentMove: null,
            excludedMove: null,
            inCheck: false,
            moveCount: 0
        };
    }
    g_searchNodes = 0;
    g_stopSearch = false;
    g_isSearching = false;
    g_bestMoveChanges = 0;
    g_previousBestMove = null;
    g_stableBestMoveCount = 0;
    g_searchStats = {
        nodes: 0, qnodes: 0, tthits: 0, ttcuts: 0,
        nullCuts: 0, lmrReductions: 0, futilityPrunes: 0,
        razorPrunes: 0, extensions: 0, checkExtensions: 0,
        singularExtensions: 0, aspirationResearches: 0, nps: 0
    };
}

function initializeBoard() {
    for (var i = 0; i < 128; i++) {
        g_board[i] = {piece: PIECE_NONE, color: -1};
    }

    var backRank = [PIECE_ROOK, PIECE_KNIGHT, PIECE_BISHOP, PIECE_QUEEN, PIECE_KING, PIECE_BISHOP, PIECE_KNIGHT, PIECE_ROOK];

    for (var file = 0; file < 8; file++) {
        g_board[file] = {piece: backRank[file], color: COLOR_WHITE};
        g_board[16 + file] = {piece: PIECE_PAWN, color: COLOR_WHITE};
        g_board[112 + file] = {piece: backRank[file], color: COLOR_BLACK};
        g_board[96 + file] = {piece: PIECE_PAWN, color: COLOR_BLACK};
    }

    g_sideToMove = COLOR_WHITE;
    g_castlingRights = CASTLE_WK | CASTLE_WQ | CASTLE_BK | CASTLE_BQ;
    g_enPassantSquare = -1;
    g_halfMoveClock = 0;
    g_fullMoveNumber = 1;
    g_phaseScore = 24;
    g_gamePhase = GAME_PHASE_OPENING;
    g_moveHistory = [];
    g_positionHistory = [];
}

function initZobrist() {
    g_zobristKeys = [];
    var seed = 0x83D24E1F;
    function rand64() {
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
        var a = seed;
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
        var b = seed;
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
        var c = seed;
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
        var d = seed;
        return (a << 48) | (b << 32) | (c << 16) | d;
    }

    for (var i = 0; i < 128; i++) {
        g_zobristKeys[i] = [];
        for (var j = 0; j < 2; j++) {
            g_zobristKeys[i][j] = [];
            for (var k = 0; k < 7; k++) {
                g_zobristKeys[i][j][k] = rand64();
            }
        }
    }

    g_zobristSide = rand64();
    g_zobristCastling[0] = rand64();
    g_zobristCastling[1] = rand64();
    g_zobristCastling[2] = rand64();
    g_zobristCastling[3] = rand64();

    for (var i = 0; i < 128; i++) {
        g_zobristEnPassant[i] = rand64();
    }
}

function computeZobristHash() {
    var hash = 0;
    for (var i = 0; i < 128; i++) {
        if (isValidSquare(i)) {
            var piece = g_board[i];
            if (piece.piece !== PIECE_NONE) {
                hash ^= g_zobristKeys[i][piece.color][piece.piece];
            }
        }
    }
    if (g_sideToMove === COLOR_BLACK) {
        hash ^= g_zobristSide;
    }
    if (g_castlingRights & CASTLE_WK) hash ^= g_zobristCastling[0];
    if (g_castlingRights & CASTLE_WQ) hash ^= g_zobristCastling[1];
    if (g_castlingRights & CASTLE_BK) hash ^= g_zobristCastling[2];
    if (g_castlingRights & CASTLE_BQ) hash ^= g_zobristCastling[3];
    if (g_enPassantSquare !== -1 && isValidSquare(g_enPassantSquare)) {
        hash ^= g_zobristEnPassant[g_enPassantSquare];
    }
    return hash;
}

function getPositionHash() {
    var hash = 0;
    for (var i = 0; i < 128; i++) {
        if (isValidSquare(i)) {
            var piece = g_board[i];
            if (piece.piece !== PIECE_NONE) {
                hash ^= g_zobristKeys[i][piece.color][piece.piece];
            }
        }
    }
    if (g_sideToMove === COLOR_BLACK) {
        hash ^= g_zobristSide;
    }
    if (g_castlingRights & CASTLE_WK) hash ^= g_zobristCastling[0];
    if (g_castlingRights & CASTLE_WQ) hash ^= g_zobristCastling[1];
    if (g_castlingRights & CASTLE_BK) hash ^= g_zobristCastling[2];
    if (g_castlingRights & CASTLE_BQ) hash ^= g_zobristCastling[3];
    if (g_enPassantSquare !== -1 && isValidSquare(g_enPassantSquare)) {
        hash ^= g_zobristEnPassant[g_enPassantSquare];
    }
    return hash;
}

function getPawnHash() {
    var hash = 0;
    for (var i = 0; i < 128; i++) {
        if (isValidSquare(i)) {
            var piece = g_board[i];
            if (piece.piece === PIECE_PAWN) {
                hash ^= g_zobristKeys[i][piece.color][PIECE_PAWN];
            }
        }
    }
    return hash;
}

function isValidSquare(sq) {
    return (sq & 0x88) === 0;
}

function squareFile(sq) {
    return sq & 7;
}

function squareRank(sq) {
    return sq >> 4;
}

function makeSquare(file, rank) {
    return (rank << 4) | file;
}

function mirrorSquare(sq) {
    return makeSquare(squareFile(sq), 7 - squareRank(sq));
}

function squareDistance(sq1, sq2) {
    return Math.max(Math.abs(squareFile(sq1) - squareFile(sq2)), Math.abs(squareRank(sq1) - squareRank(sq2)));
}

function manhattanDistance(sq1, sq2) {
    return Math.abs(squareFile(sq1) - squareFile(sq2)) + Math.abs(squareRank(sq1) - squareRank(sq2));
}

function getPieceValue(pieceType) {
    switch (pieceType) {
        case PIECE_PAWN: return g_pieceValues.pawn;
        case PIECE_KNIGHT: return g_pieceValues.knight;
        case PIECE_BISHOP: return g_pieceValues.bishop;
        case PIECE_ROOK: return g_pieceValues.rook;
        case PIECE_QUEEN: return g_pieceValues.queen;
        case PIECE_KING: return g_pieceValues.king;
        default: return 0;
    }
}

function getPieceValueFromChar(ch) {
    switch (ch.toLowerCase()) {
        case 'p': return g_pieceValues.pawn;
        case 'n': return g_pieceValues.knight;
        case 'b': return g_pieceValues.bishop;
        case 'r': return g_pieceValues.rook;
        case 'q': return g_pieceValues.queen;
        case 'k': return g_pieceValues.king;
        default: return 0;
    }
}

function updateGamePhase() {
    var phase = 0;
    for (var i = 0; i < 128; i++) {
        if (isValidSquare(i)) {
            var p = g_board[i];
            if (p.piece !== PIECE_NONE && p.piece !== PIECE_PAWN && p.piece !== PIECE_KING) {
                phase += PIECE_PHASE_VALUE[p.piece];
            }
        }
    }
    g_phaseScore = phase;
    if (phase > 18) {
        g_gamePhase = GAME_PHASE_OPENING;
    } else if (phase > 8) {
        g_gamePhase = GAME_PHASE_MIDDLEGAME;
    } else {
        g_gamePhase = GAME_PHASE_ENDGAME;
    }
}

function interpolateScore(mgScore, egScore) {
    var phase = g_phaseScore;
    if (phase > 24) phase = 24;
    return ((mgScore * phase) + (egScore * (24 - phase))) / 24;
}

function createMove(from, to, piece, captured, promotion, flags) {
    return {
        from: from,
        to: to,
        piece: piece,
        captured: captured || PIECE_NONE,
        promotion: promotion || PIECE_NONE,
        flags: flags || 0,
        score: 0
    };
}

function cloneMove(move) {
    return {
        from: move.from,
        to: move.to,
        piece: move.piece,
        captured: move.captured,
        promotion: move.promotion,
        flags: move.flags,
        score: move.score
    };
}

function movesEqual(a, b) {
    return a && b && a.from === b.from && a.to === b.to && a.promotion === b.promotion;
}

function isSquareAttacked(sq, byColor) {
    // FIXED: White pawns move +16 and capture at +15, +17. So a white pawn attacking sq is at sq-15 or sq-17.
    // Black pawns move -16 and capture at -15, -17. So a black pawn attacking sq is at sq+15 or sq+17.
    if (byColor === COLOR_WHITE) {
        if (isValidSquare(sq - 15)) {
            var p = g_board[sq - 15];
            if (p.piece === PIECE_PAWN && p.color === COLOR_WHITE) return true;
        }
        if (isValidSquare(sq - 17)) {
            var p = g_board[sq - 17];
            if (p.piece === PIECE_PAWN && p.color === COLOR_WHITE) return true;
        }
    } else {
        if (isValidSquare(sq + 15)) {
            var p = g_board[sq + 15];
            if (p.piece === PIECE_PAWN && p.color === COLOR_BLACK) return true;
        }
        if (isValidSquare(sq + 17)) {
            var p = g_board[sq + 17];
            if (p.piece === PIECE_PAWN && p.color === COLOR_BLACK) return true;
        }
    }

    for (var i = 0; i < 8; i++) {
        var from = sq + KNIGHT_DELTAS[i];
        if (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece === PIECE_KNIGHT && p.color === byColor) return true;
        }
    }

    for (var i = 0; i < 4; i++) {
        var dir = BISHOP_DELTAS[i];
        var from = sq + dir;
        while (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece !== PIECE_NONE) {
                if (p.color === byColor && (p.piece === PIECE_BISHOP || p.piece === PIECE_QUEEN)) return true;
                break;
            }
            from += dir;
        }
    }

    for (var i = 0; i < 4; i++) {
        var dir = ROOK_DELTAS[i];
        var from = sq + dir;
        while (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece !== PIECE_NONE) {
                if (p.color === byColor && (p.piece === PIECE_ROOK || p.piece === PIECE_QUEEN)) return true;
                break;
            }
            from += dir;
        }
    }

    for (var i = 0; i < 8; i++) {
        var from = sq + KING_DELTAS[i];
        if (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece === PIECE_KING && p.color === byColor) return true;
        }
    }

    return false;
}

function findKingSquare(color) {
    for (var i = 0; i < 128; i++) {
        if (isValidSquare(i)) {
            var p = g_board[i];
            if (p.piece === PIECE_KING && p.color === color) {
                return i;
            }
        }
    }
    return -1;
}

function isInCheck(color) {
    var kingSq = findKingSquare(color);
    if (kingSq === -1) return false;
    return isSquareAttacked(kingSq, 1 - color);
}

function isCheckmate(color) {
    if (!isInCheck(color)) return false;
    var moves = generateLegalMoves(color);
    return moves.length === 0;
}

function isStalemate(color) {
    if (isInCheck(color)) return false;
    var moves = generateLegalMoves(color);
    return moves.length === 0;
}

function countAttackers(sq, byColor) {
    var count = 0;
    // FIXED: Same pawn attack logic as isSquareAttacked
    if (byColor === COLOR_WHITE) {
        if (isValidSquare(sq - 15)) {
            var p = g_board[sq - 15];
            if (p.piece === PIECE_PAWN && p.color === COLOR_WHITE) count++;
        }
        if (isValidSquare(sq - 17)) {
            var p = g_board[sq - 17];
            if (p.piece === PIECE_PAWN && p.color === COLOR_WHITE) count++;
        }
    } else {
        if (isValidSquare(sq + 15)) {
            var p = g_board[sq + 15];
            if (p.piece === PIECE_PAWN && p.color === COLOR_BLACK) count++;
        }
        if (isValidSquare(sq + 17)) {
            var p = g_board[sq + 17];
            if (p.piece === PIECE_PAWN && p.color === COLOR_BLACK) count++;
        }
    }
    for (var i = 0; i < 8; i++) {
        var from = sq + KNIGHT_DELTAS[i];
        if (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece === PIECE_KNIGHT && p.color === byColor) count++;
        }
    }
    for (var i = 0; i < 4; i++) {
        var dir = BISHOP_DELTAS[i];
        var from = sq + dir;
        while (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece !== PIECE_NONE) {
                if (p.color === byColor && (p.piece === PIECE_BISHOP || p.piece === PIECE_QUEEN)) count++;
                break;
            }
            from += dir;
        }
    }
    for (var i = 0; i < 4; i++) {
        var dir = ROOK_DELTAS[i];
        var from = sq + dir;
        while (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece !== PIECE_NONE) {
                if (p.color === byColor && (p.piece === PIECE_ROOK || p.piece === PIECE_QUEEN)) count++;
                break;
            }
            from += dir;
        }
    }
    return count;
}

function getAttackingPieces(sq, byColor) {
    var attackers = [];
    // FIXED: Same pawn attack logic
    if (byColor === COLOR_WHITE) {
        if (isValidSquare(sq - 15)) {
            var p = g_board[sq - 15];
            if (p.piece === PIECE_PAWN && p.color === COLOR_WHITE) attackers.push({sq: sq - 15, piece: PIECE_PAWN});
        }
        if (isValidSquare(sq - 17)) {
            var p = g_board[sq - 17];
            if (p.piece === PIECE_PAWN && p.color === COLOR_WHITE) attackers.push({sq: sq - 17, piece: PIECE_PAWN});
        }
    } else {
        if (isValidSquare(sq + 15)) {
            var p = g_board[sq + 15];
            if (p.piece === PIECE_PAWN && p.color === COLOR_BLACK) attackers.push({sq: sq + 15, piece: PIECE_PAWN});
        }
        if (isValidSquare(sq + 17)) {
            var p = g_board[sq + 17];
            if (p.piece === PIECE_PAWN && p.color === COLOR_BLACK) attackers.push({sq: sq + 17, piece: PIECE_PAWN});
        }
    }
    for (var i = 0; i < 8; i++) {
        var from = sq + KNIGHT_DELTAS[i];
        if (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece === PIECE_KNIGHT && p.color === byColor) attackers.push({sq: from, piece: PIECE_KNIGHT});
        }
    }
    for (var i = 0; i < 4; i++) {
        var dir = BISHOP_DELTAS[i];
        var from = sq + dir;
        while (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece !== PIECE_NONE) {
                if (p.color === byColor && (p.piece === PIECE_BISHOP || p.piece === PIECE_QUEEN))
                    attackers.push({sq: from, piece: p.piece});
                break;
            }
            from += dir;
        }
    }
    for (var i = 0; i < 4; i++) {
        var dir = ROOK_DELTAS[i];
        var from = sq + dir;
        while (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece !== PIECE_NONE) {
                if (p.color === byColor && (p.piece === PIECE_ROOK || p.piece === PIECE_QUEEN))
                    attackers.push({sq: from, piece: p.piece});
                break;
            }
            from += dir;
        }
    }
    for (var i = 0; i < 8; i++) {
        var from = sq + KING_DELTAS[i];
        if (isValidSquare(from)) {
            var p = g_board[from];
            if (p.piece === PIECE_KING && p.color === byColor) attackers.push({sq: from, piece: PIECE_KING});
        }
    }
    return attackers;
}

function see(sq) {
    var seeGain = [];
    var occupiers = [];
    var currentColor = g_sideToMove;

    for (var i = 0; i < 128; i++) {
        if (isValidSquare(i) && g_board[i].piece !== PIECE_NONE) {
            occupiers[i] = g_board[i];
        }
    }

    var targetPiece = occupiers[sq] ? occupiers[sq].piece : PIECE_NONE;
    var depth = 0;
    var mayXRay = [PIECE_PAWN, PIECE_BISHOP, PIECE_ROOK, PIECE_QUEEN];

    seeGain[depth] = targetPiece ? SEE_PIECE_VALUES[targetPiece] : 0;

    do {
        var attackers = [];
        for (var i = 0; i < 128; i++) {
            if (!isValidSquare(i) || !occupiers[i] || occupiers[i].color !== currentColor) continue;
            var piece = occupiers[i];
            if (piece.piece === PIECE_PAWN) {
                // FIXED: Pawn attack logic
                if (currentColor === COLOR_WHITE) {
                    if (i + 15 === sq || i + 17 === sq) {
                        attackers.push({sq: i, piece: piece.piece, value: SEE_PIECE_VALUES[piece.piece]});
                    }
                } else {
                    if (i - 15 === sq || i - 17 === sq) {
                        attackers.push({sq: i, piece: piece.piece, value: SEE_PIECE_VALUES[piece.piece]});
                    }
                }
            } else if (piece.piece === PIECE_KNIGHT) {
                for (var j = 0; j < 8; j++) {
                    if (i + KNIGHT_DELTAS[j] === sq) {
                        attackers.push({sq: i, piece: piece.piece, value: SEE_PIECE_VALUES[piece.piece]});
                        break;
                    }
                }
            } else if (piece.piece === PIECE_BISHOP || piece.piece === PIECE_ROOK || piece.piece === PIECE_QUEEN) {
                var deltas = piece.piece === PIECE_BISHOP ? BISHOP_DELTAS : (piece.piece === PIECE_ROOK ? ROOK_DELTAS : QUEEN_DELTAS);
                for (var j = 0; j < deltas.length; j++) {
                    var to = i + deltas[j];
                    var blocked = false;
                    while (isValidSquare(to)) {
                        if (to === sq) {
                            attackers.push({sq: i, piece: piece.piece, value: SEE_PIECE_VALUES[piece.piece]});
                            blocked = true;
                            break;
                        }
                        if (occupiers[to]) {
                            blocked = true;
                            break;
                        }
                        to += deltas[j];
                    }
                    if (blocked && to === sq) break;
                }
            } else if (piece.piece === PIECE_KING) {
                for (var j = 0; j < 8; j++) {
                    if (i + KING_DELTAS[j] === sq) {
                        attackers.push({sq: i, piece: piece.piece, value: SEE_PIECE_VALUES[piece.piece]});
                        break;
                    }
                }
            }
        }

        if (attackers.length === 0) break;

        attackers.sort(function(a, b) { return a.value - b.value; });

        var attacker = attackers[0];
        depth++;
        seeGain[depth] = SEE_PIECE_VALUES[targetPiece] - seeGain[depth - 1];
        targetPiece = attacker.piece;
        occupiers[attacker.sq] = null;
        currentColor = 1 - currentColor;

    } while (depth < 32);

    while (depth > 0) {
        seeGain[depth - 1] = -Math.max(-seeGain[depth - 1], seeGain[depth]);
        depth--;
    }

    return seeGain[0];
}

function seeCapture(move) {
    return see(move.to);
}

function generatePseudoLegalMoves(color, capturesOnly) {
    var moves = [];

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var piece = g_board[i];
        if (piece.piece === PIECE_NONE || piece.color !== color) continue;

        switch (piece.piece) {
            case PIECE_PAWN:
                generatePawnMoves(i, color, moves, capturesOnly);
                break;
            case PIECE_KNIGHT:
                generateKnightMoves(i, color, moves, capturesOnly);
                break;
            case PIECE_BISHOP:
                generateSlidingMoves(i, BISHOP_DELTAS, color, moves, capturesOnly);
                break;
            case PIECE_ROOK:
                generateSlidingMoves(i, ROOK_DELTAS, color, moves, capturesOnly);
                break;
            case PIECE_QUEEN:
                generateSlidingMoves(i, QUEEN_DELTAS, color, moves, capturesOnly);
                break;
            case PIECE_KING:
                generateKingMoves(i, color, moves, capturesOnly);
                break;
        }
    }

    return moves;
}

function generateLegalMoves(color) {
    var pseudoMoves = generatePseudoLegalMoves(color, false);
    var legalMoves = [];

    for (var i = 0; i < pseudoMoves.length; i++) {
        var move = pseudoMoves[i];
        makeMove(move);
        if (!isInCheck(color)) {
            legalMoves.push(move);
        }
        undoMove();
    }

    return legalMoves;
}

function generateCaptureMoves(color) {
    return generatePseudoLegalMoves(color, true);
}

function generatePawnMoves(from, color, moves, capturesOnly) {
    // FIXED: White pawns move toward higher ranks (+16), Black toward lower ranks (-16)
    var direction = color === COLOR_WHITE ? 16 : -16;
    var startRank = color === COLOR_WHITE ? 1 : 6;
    var promoRank = color === COLOR_WHITE ? 7 : 0;
    var to = from + direction;

    // Forward moves (only if not captures-only)
    if (!capturesOnly && isValidSquare(to) && g_board[to].piece === PIECE_NONE) {
        var r = squareRank(to);
        if (r === promoRank) {
            moves.push(createMove(from, to, PIECE_PAWN, PIECE_NONE, PIECE_QUEEN, FLAG_PROMOTION));
            moves.push(createMove(from, to, PIECE_PAWN, PIECE_NONE, PIECE_ROOK, FLAG_PROMOTION));
            moves.push(createMove(from, to, PIECE_PAWN, PIECE_NONE, PIECE_BISHOP, FLAG_PROMOTION));
            moves.push(createMove(from, to, PIECE_PAWN, PIECE_NONE, PIECE_KNIGHT, FLAG_PROMOTION));
        } else {
            moves.push(createMove(from, to, PIECE_PAWN, PIECE_NONE, PIECE_NONE, FLAG_NONE));
        }

        // Double push from starting rank
        var fromRank = squareRank(from);
        if (fromRank === startRank) {
            var doubleTo = from + direction * 2;
            if (isValidSquare(doubleTo) && g_board[doubleTo].piece === PIECE_NONE) {
                moves.push(createMove(from, doubleTo, PIECE_PAWN, PIECE_NONE, PIECE_NONE, FLAG_PAWN_DOUBLE));
            }
        }
    }

    // Diagonal captures (ALWAYS generated, independent of forward move)
    for (var i = -1; i <= 1; i += 2) {
        var captureTo = to + i;
        if (!isValidSquare(captureTo)) continue;

        var target = g_board[captureTo];
        if (target.piece !== PIECE_NONE && target.color !== color) {
            var cr = squareRank(captureTo);
            if (cr === promoRank) {
                moves.push(createMove(from, captureTo, PIECE_PAWN, target.piece, PIECE_QUEEN, FLAG_PROMOTION));
                moves.push(createMove(from, captureTo, PIECE_PAWN, target.piece, PIECE_ROOK, FLAG_PROMOTION));
                moves.push(createMove(from, captureTo, PIECE_PAWN, target.piece, PIECE_BISHOP, FLAG_PROMOTION));
                moves.push(createMove(from, captureTo, PIECE_PAWN, target.piece, PIECE_KNIGHT, FLAG_PROMOTION));
            } else {
                moves.push(createMove(from, captureTo, PIECE_PAWN, target.piece, PIECE_NONE, FLAG_NONE));
            }
        }

        // En passant
        if (captureTo === g_enPassantSquare) {
            moves.push(createMove(from, captureTo, PIECE_PAWN, PIECE_PAWN, PIECE_NONE, FLAG_ENPASSANT));
        }
    }
}

function generateKnightMoves(from, color, moves, capturesOnly) {
    var piece = g_board[from];
    for (var i = 0; i < 8; i++) {
        var to = from + KNIGHT_DELTAS[i];
        if (!isValidSquare(to)) continue;
        var target = g_board[to];
        if (target.piece === PIECE_NONE) {
            if (!capturesOnly) {
                moves.push(createMove(from, to, piece.piece, PIECE_NONE, PIECE_NONE, FLAG_NONE));
            }
        } else if (target.color !== color) {
            moves.push(createMove(from, to, piece.piece, target.piece, PIECE_NONE, FLAG_NONE));
        }
    }
}

function generateSlidingMoves(from, deltas, color, moves, capturesOnly) {
    var piece = g_board[from];
    for (var i = 0; i < deltas.length; i++) {
        var dir = deltas[i];
        var to = from + dir;
        while (isValidSquare(to)) {
            var target = g_board[to];
            if (target.piece === PIECE_NONE) {
                if (!capturesOnly) {
                    moves.push(createMove(from, to, piece.piece, PIECE_NONE, PIECE_NONE, FLAG_NONE));
                }
            } else {
                if (target.color !== color) {
                    moves.push(createMove(from, to, piece.piece, target.piece, PIECE_NONE, FLAG_NONE));
                }
                break;
            }
            to += dir;
        }
    }
}

function generateKingMoves(from, color, moves, capturesOnly) {
    for (var i = 0; i < 8; i++) {
        var to = from + KING_DELTAS[i];
        if (!isValidSquare(to)) continue;
        var target = g_board[to];
        if (target.piece === PIECE_NONE) {
            if (!capturesOnly) {
                moves.push(createMove(from, to, PIECE_KING, PIECE_NONE, PIECE_NONE, FLAG_NONE));
            }
        } else if (target.color !== color) {
            moves.push(createMove(from, to, PIECE_KING, target.piece, PIECE_NONE, FLAG_NONE));
        }
    }

    if (!capturesOnly && !isInCheck(color)) {
        if (color === COLOR_WHITE) {
            if ((g_castlingRights & CASTLE_WK) &&
                g_board[SQUARE_F1].piece === PIECE_NONE &&
                g_board[SQUARE_G1].piece === PIECE_NONE &&
                !isSquareAttacked(SQUARE_F1, COLOR_BLACK) &&
                !isSquareAttacked(SQUARE_G1, COLOR_BLACK)) {
                moves.push(createMove(SQUARE_E1, SQUARE_G1, PIECE_KING, PIECE_NONE, PIECE_NONE, FLAG_CASTLING));
            }
            if ((g_castlingRights & CASTLE_WQ) &&
                g_board[SQUARE_D1].piece === PIECE_NONE &&
                g_board[SQUARE_C1].piece === PIECE_NONE &&
                g_board[SQUARE_B1].piece === PIECE_NONE &&
                !isSquareAttacked(SQUARE_D1, COLOR_BLACK) &&
                !isSquareAttacked(SQUARE_C1, COLOR_BLACK)) {
                moves.push(createMove(SQUARE_E1, SQUARE_C1, PIECE_KING, PIECE_NONE, PIECE_NONE, FLAG_CASTLING));
            }
        } else {
            if ((g_castlingRights & CASTLE_BK) &&
                g_board[SQUARE_F8].piece === PIECE_NONE &&
                g_board[SQUARE_G8].piece === PIECE_NONE &&
                !isSquareAttacked(SQUARE_F8, COLOR_WHITE) &&
                !isSquareAttacked(SQUARE_G8, COLOR_WHITE)) {
                moves.push(createMove(SQUARE_E8, SQUARE_G8, PIECE_KING, PIECE_NONE, PIECE_NONE, FLAG_CASTLING));
            }
            if ((g_castlingRights & CASTLE_BQ) &&
                g_board[SQUARE_D8].piece === PIECE_NONE &&
                g_board[SQUARE_C8].piece === PIECE_NONE &&
                g_board[SQUARE_B8].piece === PIECE_NONE &&
                !isSquareAttacked(SQUARE_D8, COLOR_WHITE) &&
                !isSquareAttacked(SQUARE_C8, COLOR_WHITE)) {
                moves.push(createMove(SQUARE_E8, SQUARE_C8, PIECE_KING, PIECE_NONE, PIECE_NONE, FLAG_CASTLING));
            }
        }
    }
}

function generateEvasions(color) {
    var kingSq = findKingSquare(color);
    var moves = [];

    for (var i = 0; i < 8; i++) {
        var to = kingSq + KING_DELTAS[i];
        if (!isValidSquare(to)) continue;
        if (!isSquareAttacked(to, 1 - color)) {
            var target = g_board[to];
            if (target.piece === PIECE_NONE) {
                moves.push(createMove(kingSq, to, PIECE_KING, PIECE_NONE, PIECE_NONE, FLAG_NONE));
            } else if (target.color !== color) {
                moves.push(createMove(kingSq, to, PIECE_KING, target.piece, PIECE_NONE, FLAG_NONE));
            }
        }
    }

    var checkers = [];
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece !== PIECE_NONE && p.color !== color) {
            if (pieceAttacksSquare(i, p, kingSq)) {
                checkers.push(i);
            }
        }
    }

    if (checkers.length === 1) {
        var checkerSq = checkers[0];
        var checkerPiece = g_board[checkerSq];

        for (var i = 0; i < 128; i++) {
            if (!isValidSquare(i)) continue;
            var piece = g_board[i];
            if (piece.piece === PIECE_NONE || piece.color !== color || piece.piece === PIECE_KING) continue;

            var between = getSquaresBetween(checkerSq, kingSq);
            for (var j = 0; j < between.length; j++) {
                if (pieceCanMoveTo(i, piece, between[j])) {
                    moves.push(createMove(i, between[j], piece.piece, PIECE_NONE, PIECE_NONE, FLAG_NONE));
                }
            }

            if (pieceCanMoveTo(i, piece, checkerSq)) {
                moves.push(createMove(i, checkerSq, piece.piece, checkerPiece.piece, PIECE_NONE, FLAG_NONE));
            }
        }
    }

    return moves;
}

function pieceAttacksSquare(fromSq, piece, toSq) {
    if (piece.piece === PIECE_PAWN) {
        // FIXED: White pawn at fromSq attacks fromSq+15 and fromSq+17
        // Black pawn at fromSq attacks fromSq-15 and fromSq-17
        if (piece.color === COLOR_WHITE) {
            return (fromSq + 15 === toSq) || (fromSq + 17 === toSq);
        } else {
            return (fromSq - 15 === toSq) || (fromSq - 17 === toSq);
        }
    }
    if (piece.piece === PIECE_KNIGHT) {
        for (var i = 0; i < 8; i++) {
            if (fromSq + KNIGHT_DELTAS[i] === toSq) return true;
        }
        return false;
    }
    if (piece.piece === PIECE_KING) {
        for (var i = 0; i < 8; i++) {
            if (fromSq + KING_DELTAS[i] === toSq) return true;
        }
        return false;
    }
    if (piece.piece === PIECE_BISHOP || piece.piece === PIECE_ROOK || piece.piece === PIECE_QUEEN) {
        var deltas = piece.piece === PIECE_BISHOP ? BISHOP_DELTAS : (piece.piece === PIECE_ROOK ? ROOK_DELTAS : QUEEN_DELTAS);
        var fromFile = squareFile(fromSq);
        var fromRank = squareRank(fromSq);
        var toFile = squareFile(toSq);
        var toRank = squareRank(toSq);

        for (var i = 0; i < deltas.length; i++) {
            var dir = deltas[i];
            var df = squareFile(fromSq + dir) - fromFile;
            var dr = squareRank(fromSq + dir) - fromRank;
            if (df === 0 && dr === 0) continue;

            var steps = 0;
            if (df !== 0) steps = Math.floor((toFile - fromFile) / df);
            else if (dr !== 0) steps = Math.floor((toRank - fromRank) / dr);

            if (steps <= 0) continue;

            var valid = true;
            var current = fromSq;
            for (var s = 0; s < steps; s++) {
                current += dir;
                if (!isValidSquare(current)) {
                    valid = false;
                    break;
                }
                if (s < steps - 1 && g_board[current].piece !== PIECE_NONE) {
                    valid = false;
                    break;
                }
            }
            if (valid && current === toSq) return true;
        }
        return false;
    }
    return false;
}

function pieceCanMoveTo(fromSq, piece, toSq) {
    return pieceAttacksSquare(fromSq, piece, toSq);
}

function getSquaresBetween(sq1, sq2) {
    var result = [];
    var f1 = squareFile(sq1), r1 = squareRank(sq1);
    var f2 = squareFile(sq2), r2 = squareRank(sq2);

    if (f1 !== f2 && r1 !== r2 && Math.abs(f1 - f2) !== Math.abs(r1 - r2)) return result;

    var df = f2 > f1 ? 1 : (f2 < f1 ? -1 : 0);
    var dr = r2 > r1 ? 1 : (r2 < r1 ? -1 : 0);

    var f = f1 + df;
    var r = r1 + dr;

    while (f !== f2 || r !== r2) {
        result.push(makeSquare(f, r));
        f += df;
        r += dr;
    }

    return result;
}

function makeMove(move) {
    var undoInfo = {
        move: cloneMove(move),
        castlingRights: g_castlingRights,
        enPassantSquare: g_enPassantSquare,
        halfMoveClock: g_halfMoveClock,
        capturedPiece: g_board[move.to].piece,
        capturedColor: g_board[move.to].color,
        sideToMove: g_sideToMove
    };

    g_board[move.to] = {piece: move.piece, color: g_sideToMove};
    g_board[move.from] = {piece: PIECE_NONE, color: -1};

    if (move.promotion !== PIECE_NONE) {
        g_board[move.to] = {piece: move.promotion, color: g_sideToMove};
    }

    if (move.flags & FLAG_ENPASSANT) {
        // FIXED: After moving, sideToMove has already switched, so the captured pawn is BEHIND the to-square
        // relative to the mover's direction. White moved +16, so captured pawn is at to - 16 (behind)
        // But g_sideToMove has ALREADY been flipped in the calling code... wait, no it hasn't yet
        // Actually g_sideToMove is still the mover here. White moves +16, captured pawn is at to - 16
        var capturedPawnSq = move.to + (g_sideToMove === COLOR_WHITE ? -16 : 16);
        undoInfo.enPassantCapture = {
            sq: capturedPawnSq,
            piece: g_board[capturedPawnSq].piece,
            color: g_board[capturedPawnSq].color
        };
        g_board[capturedPawnSq] = {piece: PIECE_NONE, color: -1};
    }

    if (move.flags & FLAG_CASTLING) {
        if (move.to === SQUARE_G1) {
            undoInfo.castleRookFrom = SQUARE_H1;
            undoInfo.castleRookTo = SQUARE_F1;
            g_board[SQUARE_F1] = g_board[SQUARE_H1];
            g_board[SQUARE_H1] = {piece: PIECE_NONE, color: -1};
        } else if (move.to === SQUARE_C1) {
            undoInfo.castleRookFrom = SQUARE_A1;
            undoInfo.castleRookTo = SQUARE_D1;
            g_board[SQUARE_D1] = g_board[SQUARE_A1];
            g_board[SQUARE_A1] = {piece: PIECE_NONE, color: -1};
        } else if (move.to === SQUARE_G8) {
            undoInfo.castleRookFrom = SQUARE_H8;
            undoInfo.castleRookTo = SQUARE_F8;
            g_board[SQUARE_F8] = g_board[SQUARE_H8];
            g_board[SQUARE_H8] = {piece: PIECE_NONE, color: -1};
        } else if (move.to === SQUARE_C8) {
            undoInfo.castleRookFrom = SQUARE_A8;
            undoInfo.castleRookTo = SQUARE_D8;
            g_board[SQUARE_D8] = g_board[SQUARE_A8];
            g_board[SQUARE_A8] = {piece: PIECE_NONE, color: -1};
        }
    }

    if (move.piece === PIECE_KING) {
        if (g_sideToMove === COLOR_WHITE) {
            g_castlingRights &= ~(CASTLE_WK | CASTLE_WQ);
        } else {
            g_castlingRights &= ~(CASTLE_BK | CASTLE_BQ);
        }
    }

    if (move.from === SQUARE_A1 || move.to === SQUARE_A1) g_castlingRights &= ~CASTLE_WQ;
    if (move.from === SQUARE_H1 || move.to === SQUARE_H1) g_castlingRights &= ~CASTLE_WK;
    if (move.from === SQUARE_A8 || move.to === SQUARE_A8) g_castlingRights &= ~CASTLE_BQ;
    if (move.from === SQUARE_H8 || move.to === SQUARE_H8) g_castlingRights &= ~CASTLE_BK;

    if (move.flags & FLAG_PAWN_DOUBLE) {
        // FIXED: En passant square is the square the pawn skipped over
        // White: from rank 1, to rank 3, en passant at rank 2 = from + 16
        // Black: from rank 6, to rank 4, en passant at rank 5 = from - 16
        g_enPassantSquare = move.from + (g_sideToMove === COLOR_WHITE ? 16 : -16);
    } else {
        g_enPassantSquare = -1;
    }

    if (move.piece === PIECE_PAWN || move.captured !== PIECE_NONE) {
        g_halfMoveClock = 0;
    } else {
        g_halfMoveClock++;
    }

    if (g_sideToMove === COLOR_BLACK) {
        g_fullMoveNumber++;
    }

    g_sideToMove = 1 - g_sideToMove;
    g_moveHistory.push(undoInfo);
    updateGamePhase();
}

function undoMove() {
    if (g_moveHistory.length === 0) return;

    var undoInfo = g_moveHistory.pop();
    var move = undoInfo.move;

    g_sideToMove = undoInfo.sideToMove;

    g_board[move.from] = {piece: move.piece, color: g_sideToMove};

    if (move.flags & FLAG_ENPASSANT) {
        g_board[move.to] = {piece: PIECE_NONE, color: -1};
        if (undoInfo.enPassantCapture) {
            g_board[undoInfo.enPassantCapture.sq] = {
                piece: undoInfo.enPassantCapture.piece,
                color: undoInfo.enPassantCapture.color
            };
        }
    } else {
        g_board[move.to] = {piece: undoInfo.capturedPiece, color: undoInfo.capturedColor};
    }

    if (move.flags & FLAG_CASTLING) {
        g_board[undoInfo.castleRookFrom] = g_board[undoInfo.castleRookTo];
        g_board[undoInfo.castleRookTo] = {piece: PIECE_NONE, color: -1};
    }

    g_castlingRights = undoInfo.castlingRights;
    g_enPassantSquare = undoInfo.enPassantSquare;
    g_halfMoveClock = undoInfo.halfMoveClock;

    if (g_sideToMove === COLOR_BLACK) {
        g_fullMoveNumber--;
    }

    updateGamePhase();
}

function makeNullMove() {
    var undoInfo = {
        sideToMove: g_sideToMove,
        enPassantSquare: g_enPassantSquare,
        halfMoveClock: g_halfMoveClock
    };
    g_enPassantSquare = -1;
    g_sideToMove = 1 - g_sideToMove;
    if (g_sideToMove === COLOR_BLACK) {
        g_fullMoveNumber++;
    }
    g_moveHistory.push({isNull: true, data: undoInfo});
}

function undoNullMove() {
    if (g_moveHistory.length === 0) return;
    var info = g_moveHistory.pop();
    if (!info.isNull) {
        g_moveHistory.push(info);
        return;
    }
    var undoInfo = info.data;
    if (g_sideToMove === COLOR_WHITE) {
        g_fullMoveNumber--;
    }
    g_sideToMove = undoInfo.sideToMove;
    g_enPassantSquare = undoInfo.enPassantSquare;
    g_halfMoveClock = undoInfo.halfMoveClock;
}


function getPSTValue(pieceType, square, isEndgame) {
    var idx = squareRank(square) * 8 + squareFile(square);
    switch (pieceType) {
        case PIECE_PAWN:
            return isEndgame ? PST_EG_PAWN[idx] : PST_MG_PAWN[idx];
        case PIECE_KNIGHT:
            return isEndgame ? PST_EG_KNIGHT[idx] : PST_MG_KNIGHT[idx];
        case PIECE_BISHOP:
            return isEndgame ? PST_EG_BISHOP[idx] : PST_MG_BISHOP[idx];
        case PIECE_ROOK:
            return isEndgame ? PST_EG_ROOK[idx] : PST_MG_ROOK[idx];
        case PIECE_QUEEN:
            return isEndgame ? PST_EG_QUEEN[idx] : PST_MG_QUEEN[idx];
        case PIECE_KING:
            return isEndgame ? PST_EG_KING[idx] : PST_MG_KING[idx];
        default:
            return 0;
    }
}

function getBlackPSTIndex(sq) {
    var f = squareFile(sq);
    var r = squareRank(sq);
    return (7 - r) * 8 + f;
}

function clearEvaluationCache() {
    g_evalCache = {};
}

function clearPawnHashTable() {
    g_pawnHashTable = {};
}

function evaluateMaterial() {
    var score = 0;
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE) continue;
        var val = getPieceValue(p.piece);
        if (p.color === COLOR_WHITE) score += val;
        else score -= val;
    }
    return score;
}

function evaluatePST() {
    var score = 0;
    var isEG = g_gamePhase === GAME_PHASE_ENDGAME;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE) continue;

        var sq = p.color === COLOR_WHITE ? i : getBlackPSTIndex(i);
        var pstVal = getPSTValue(p.piece, sq, isEG);

        if (p.color === COLOR_WHITE) score += pstVal;
        else score -= pstVal;
    }

    return score;
}

function evaluateMobility() {
    var score = 0;

    for (var color = 0; color < 2; color++) {
        for (var i = 0; i < 128; i++) {
            if (!isValidSquare(i)) continue;
            var p = g_board[i];
            if (p.piece === PIECE_NONE || p.color !== color) continue;

            var mobility = 0;
            if (p.piece === PIECE_KNIGHT) {
                for (var j = 0; j < 8; j++) {
                    var to = i + KNIGHT_DELTAS[j];
                    if (isValidSquare(to) && (g_board[to].piece === PIECE_NONE || g_board[to].color !== color)) mobility++;
                }
                var bonus = MOBILITY_BONUS_KNIGHT[Math.min(mobility, 8)] || 0;
                score += (color === COLOR_WHITE ? bonus : -bonus) * g_engineOptions.mobilityWeight / 8;
            } else if (p.piece === PIECE_BISHOP) {
                for (var j = 0; j < 4; j++) {
                    var to = i + BISHOP_DELTAS[j];
                    while (isValidSquare(to)) {
                        if (g_board[to].piece === PIECE_NONE) {
                            mobility++;
                        } else {
                            if (g_board[to].color !== color) mobility++;
                            break;
                        }
                        to += BISHOP_DELTAS[j];
                    }
                }
                var bonus = MOBILITY_BONUS_BISHOP[Math.min(mobility, 13)] || 0;
                score += (color === COLOR_WHITE ? bonus : -bonus) * g_engineOptions.mobilityWeight / 8;
            } else if (p.piece === PIECE_ROOK) {
                for (var j = 0; j < 4; j++) {
                    var to = i + ROOK_DELTAS[j];
                    while (isValidSquare(to)) {
                        if (g_board[to].piece === PIECE_NONE) {
                            mobility++;
                        } else {
                            if (g_board[to].color !== color) mobility++;
                            break;
                        }
                        to += ROOK_DELTAS[j];
                    }
                }
                var bonus = MOBILITY_BONUS_ROOK[Math.min(mobility, 14)] || 0;
                score += (color === COLOR_WHITE ? bonus : -bonus) * g_engineOptions.mobilityWeight / 8;
            } else if (p.piece === PIECE_QUEEN) {
                for (var j = 0; j < 8; j++) {
                    var to = i + QUEEN_DELTAS[j];
                    while (isValidSquare(to)) {
                        if (g_board[to].piece === PIECE_NONE) {
                            mobility++;
                        } else {
                            if (g_board[to].color !== color) mobility++;
                            break;
                        }
                        to += QUEEN_DELTAS[j];
                    }
                }
                var bonus = MOBILITY_BONUS_QUEEN[Math.min(mobility, 27)] || 0;
                score += (color === COLOR_WHITE ? bonus : -bonus) * g_engineOptions.mobilityWeight / 8;
            }
        }
    }

    return score;
}

function evaluatePawnStructure() {
    var pawnHash = getPawnHash();
    if (g_pawnHashTable[pawnHash] !== undefined) {
        return g_pawnHashTable[pawnHash];
    }

    var score = 0;
    var whitePawnsByFile = [0, 0, 0, 0, 0, 0, 0, 0];
    var blackPawnsByFile = [0, 0, 0, 0, 0, 0, 0, 0];
    var whitePawnRanks = [0, 0, 0, 0, 0, 0, 0, 0];
    var blackPawnRanks = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece !== PIECE_PAWN) continue;
        var f = squareFile(i);
        var r = squareRank(i);
        if (p.color === COLOR_WHITE) {
            whitePawnsByFile[f]++;
            if (whitePawnRanks[f] === 0 || r > whitePawnRanks[f]) whitePawnRanks[f] = r;
        } else {
            blackPawnsByFile[f]++;
            if (blackPawnRanks[f] === 0 || r < blackPawnRanks[f]) blackPawnRanks[f] = r;
        }
    }

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece !== PIECE_PAWN) continue;
        var f = squareFile(i);
        var r = squareRank(i);
        var isWhite = p.color === COLOR_WHITE;

        if (isWhite) {
            if (whitePawnsByFile[f] > 1) {
                score -= g_engineOptions.doubledPawnPenalty * (whitePawnsByFile[f] - 1);
            }
        } else {
            if (blackPawnsByFile[f] > 1) {
                score += g_engineOptions.doubledPawnPenalty * (blackPawnsByFile[f] - 1);
            }
        }

        var hasNeighbor = false;
        if (f > 0) {
            if (isWhite && whitePawnsByFile[f - 1] > 0) hasNeighbor = true;
            if (!isWhite && blackPawnsByFile[f - 1] > 0) hasNeighbor = true;
        }
        if (f < 7) {
            if (isWhite && whitePawnsByFile[f + 1] > 0) hasNeighbor = true;
            if (!isWhite && blackPawnsByFile[f + 1] > 0) hasNeighbor = true;
        }

        if (!hasNeighbor) {
            if (isWhite) score -= g_engineOptions.isolatedPawnPenalty;
            else score += g_engineOptions.isolatedPawnPenalty;
        }

        var isBackward = true;
        if (f > 0) {
            var checkRank = isWhite ? r + 1 : r - 1;
            if (isWhite && whitePawnRanks[f - 1] > checkRank) isBackward = false;
            if (!isWhite && blackPawnRanks[f - 1] < checkRank) isBackward = false;
        }
        if (f < 7) {
            var checkRank = isWhite ? r + 1 : r - 1;
            if (isWhite && whitePawnRanks[f + 1] > checkRank) isBackward = false;
            if (!isWhite && blackPawnRanks[f + 1] < checkRank) isBackward = false;
        }
        if (isBackward && !hasNeighbor) {
            if (isWhite) score -= g_engineOptions.backwardPawnPenalty;
            else score += g_engineOptions.backwardPawnPenalty;
        }

        var isPassed = true;
        if (isWhite) {
            for (var rf = Math.max(0, f - 1); rf <= Math.min(7, f + 1); rf++) {
                if (blackPawnsByFile[rf] > 0 && blackPawnRanks[rf] < r) {
                    isPassed = false;
                    break;
                }
            }
        } else {
            for (var rf = Math.max(0, f - 1); rf <= Math.min(7, f + 1); rf++) {
                if (whitePawnsByFile[rf] > 0 && whitePawnRanks[rf] > r) {
                    isPassed = false;
                    break;
                }
            }
        }

        if (isPassed) {
            // FIXED: dist should be how close to promotion (higher = closer = more bonus)
            var dist = isWhite ? r : 7 - r;
            var bonus = PASSED_PAWN_BONUS_MG[dist] * (24 - g_phaseScore) / 24 +
                       PASSED_PAWN_BONUS_EG[dist] * g_phaseScore / 24;
            if (isWhite) score += bonus * g_engineOptions.passedPawnWeight / 50;
            else score -= bonus * g_engineOptions.passedPawnWeight / 50;
        }

        var isCandidate = !isPassed;
        if (isCandidate) {
            var blockers = 0;
            if (isWhite) {
                for (var rf = Math.max(0, f - 1); rf <= Math.min(7, f + 1); rf++) {
                    if (blackPawnsByFile[rf] > 0) blockers++;
                }
            } else {
                for (var rf = Math.max(0, f - 1); rf <= Math.min(7, f + 1); rf++) {
                    if (whitePawnsByFile[rf] > 0) blockers++;
                }
            }
            if (blockers === 1) {
                // FIXED: Same distance logic
                var dist = isWhite ? r : 7 - r;
                if (isWhite) score += CANDIDATE_PASSED_PAWN_BONUS[dist] * g_engineOptions.passedPawnWeight / 100;
                else score -= CANDIDATE_PASSED_PAWN_BONUS[dist] * g_engineOptions.passedPawnWeight / 100;
            }
        }

        if (isWhite && r >= 4) score += g_engineOptions.advancedPawnBonus * (r - 3) / 4;
        if (!isWhite && r <= 3) score -= g_engineOptions.advancedPawnBonus * (4 - r) / 4;

        if (f >= 2 && f <= 5) {
            if (isWhite && r >= 2 && r <= 4) score += g_engineOptions.centralPawnBonus;
            if (!isWhite && r >= 3 && r <= 5) score -= g_engineOptions.centralPawnBonus;
        }

        if (f >= 3 && f <= 4 && r >= 3 && r <= 4) {
            if (isWhite) score += g_engineOptions.centralPawnBonus;
            else score -= g_engineOptions.centralPawnBonus;
        }

        var isChained = false;
        // FIXED: White pawns are chained by pawns BEHIND them (lower rank)
        if (f > 0) {
            var adjSq = makeSquare(f - 1, isWhite ? r - 1 : r + 1);
            if (isValidSquare(adjSq) && g_board[adjSq].piece === PIECE_PAWN && g_board[adjSq].color === p.color) isChained = true;
        }
        if (f < 7) {
            var adjSq = makeSquare(f + 1, isWhite ? r - 1 : r + 1);
            if (isValidSquare(adjSq) && g_board[adjSq].piece === PIECE_PAWN && g_board[adjSq].color === p.color) isChained = true;
        }
        if (isChained) {
            if (isWhite) score += g_engineOptions.pawnChainBonus;
            else score -= g_engineOptions.pawnChainBonus;
        }

        if (f <= 1 || f >= 6) {
            if (r >= 4 && isWhite) score -= g_engineOptions.overextendedPawnPenalty;
            if (r <= 3 && !isWhite) score += g_engineOptions.overextendedPawnPenalty;
        }
    }

    g_pawnHashTable[pawnHash] = score * g_engineOptions.pawnStructureWeight / 12;
    return g_pawnHashTable[pawnHash];
}

function evaluateKingSafety() {
    var score = 0;
    var wKingSq = findKingSquare(COLOR_WHITE);
    var bKingSq = findKingSquare(COLOR_BLACK);

    if (wKingSq === -1 || bKingSq === -1) return 0;

    var wKingFile = squareFile(wKingSq);
    var wKingRank = squareRank(wKingSq);
    var bKingFile = squareFile(bKingSq);
    var bKingRank = squareRank(bKingSq);

    var wAttacks = 0, wAttackers = 0;
    var bAttacks = 0, bAttackers = 0;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE || p.piece === PIECE_PAWN || p.piece === PIECE_KING) continue;

        var f = squareFile(i);
        var r = squareRank(i);

        if (p.color === COLOR_BLACK) {
            var distToWK = Math.max(Math.abs(f - wKingFile), Math.abs(r - wKingRank));
            if (distToWK <= 3) {
                bAttacks += getPieceValue(p.piece) / 200;
                bAttackers++;
            }
        }

        if (p.color === COLOR_WHITE) {
            var distToBK = Math.max(Math.abs(f - bKingFile), Math.abs(r - bKingRank));
            if (distToBK <= 3) {
                wAttacks += getPieceValue(p.piece) / 200;
                wAttackers++;
            }
        }
    }

    var wAttackIndex = Math.min(Math.floor(bAttacks + bAttackers), 10);
    var bAttackIndex = Math.min(Math.floor(wAttacks + wAttackers), 10);

    score -= KING_SAFETY_ATTACK_VALUE[wAttackIndex] * g_engineOptions.kingSafetyWeight / 100;
    score += KING_SAFETY_ATTACK_VALUE[bAttackIndex] * g_engineOptions.kingSafetyWeight / 100;

    score += evaluatePawnShield(wKingSq, COLOR_WHITE) * g_engineOptions.pawnShieldWeight / 20;
    score -= evaluatePawnShield(bKingSq, COLOR_BLACK) * g_engineOptions.pawnShieldWeight / 20;

    score += evaluatePawnStorm(wKingSq, COLOR_WHITE) * g_engineOptions.pawnStormWeight / 20;
    score -= evaluatePawnStorm(bKingSq, COLOR_BLACK) * g_engineOptions.pawnStormWeight / 20;

    var wOpenFiles = 0, bOpenFiles = 0;
    for (var f = Math.max(0, wKingFile - 1); f <= Math.min(7, wKingFile + 1); f++) {
        var hasWhitePawn = false, hasBlackPawn = false;
        for (var r = 0; r < 8; r++) {
            var sq = makeSquare(f, r);
            if (g_board[sq].piece === PIECE_PAWN) {
                if (g_board[sq].color === COLOR_WHITE) hasWhitePawn = true;
                else hasBlackPawn = true;
            }
        }
        if (!hasWhitePawn && !hasBlackPawn) wOpenFiles++;
        if (!hasWhitePawn && hasBlackPawn) wOpenFiles += 0.5;
    }
    for (var f = Math.max(0, bKingFile - 1); f <= Math.min(7, bKingFile + 1); f++) {
        var hasWhitePawn = false, hasBlackPawn = false;
        for (var r = 0; r < 8; r++) {
            var sq = makeSquare(f, r);
            if (g_board[sq].piece === PIECE_PAWN) {
                if (g_board[sq].color === COLOR_WHITE) hasWhitePawn = true;
                else hasBlackPawn = true;
            }
        }
        if (!hasWhitePawn && !hasBlackPawn) bOpenFiles++;
        if (hasWhitePawn && !hasBlackPawn) bOpenFiles += 0.5;
    }

    score -= wOpenFiles * 15 * g_engineOptions.kingSafetyWeight / 100;
    score += bOpenFiles * 15 * g_engineOptions.kingSafetyWeight / 100;

    return score;
}

function evaluatePawnShield(kingSq, color) {
    var score = 0;
    var kf = squareFile(kingSq);
    var kr = squareRank(kingSq);

    var shieldRanks = color === COLOR_WHITE ? [1, 2] : [6, 5];

    for (var i = 0; i < shieldRanks.length; i++) {
        var sr = shieldRanks[i];
        var weight = i === 0 ? 3 : 1;
        for (var df = -1; df <= 1; df++) {
            var f = kf + df;
            if (f < 0 || f > 7) continue;
            var sq = makeSquare(f, sr);
            if (g_board[sq].piece === PIECE_PAWN && g_board[sq].color === color) {
                score += 5 * weight;
            }
        }
    }

    return score;
}

function evaluatePawnStorm(kingSq, color) {
    var score = 0;
    var kf = squareFile(kingSq);
    var enemyColor = 1 - color;
    // FIXED: Storm ranks should be ordered so closer pawns to enemy king get higher penalty
    var stormRanks = color === COLOR_WHITE ? [3, 4, 5] : [2, 3, 4];

    for (var df = -1; df <= 1; df++) {
        var f = kf + df;
        if (f < 0 || f > 7) continue;
        for (var i = 0; i < stormRanks.length; i++) {
            var sq = makeSquare(f, stormRanks[i]);
            if (g_board[sq].piece === PIECE_PAWN && g_board[sq].color === enemyColor) {
                score -= 3 * (3 - i);
            }
        }
    }

    return score;
}

function evaluateRooks() {
    var score = 0;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece !== PIECE_ROOK) continue;

        var f = squareFile(i);
        var r = squareRank(i);
        var sign = p.color === COLOR_WHITE ? 1 : -1;

        var isOpen = true, isSemiOpen = true;
        for (var rank = 0; rank < 8; rank++) {
            var sq = makeSquare(f, rank);
            var piece = g_board[sq];
            if (piece.piece === PIECE_PAWN) {
                if (piece.color === p.color) {
                    isOpen = false;
                    isSemiOpen = false;
                } else {
                    isOpen = false;
                }
            }
        }

        if (isOpen) score += g_engineOptions.rookOnOpenFile * sign;
        else if (isSemiOpen) score += g_engineOptions.rookOnSemiOpenFile * sign;

        if ((p.color === COLOR_WHITE && r === 6) || (p.color === COLOR_BLACK && r === 1)) {
            score += g_engineOptions.rookOnSeventhRank * sign;
        }

        if (r >= 4 && p.color === COLOR_WHITE) score += 2 * sign;
        if (r <= 3 && p.color === COLOR_BLACK) score -= 2 * sign;

        var hasOwnRook = false;
        for (var file = 0; file < 8; file++) {
            var sq = makeSquare(file, r);
            if (sq !== i && g_board[sq].piece === PIECE_ROOK && g_board[sq].color === p.color) {
                hasOwnRook = true;
                break;
            }
        }
        if (hasOwnRook) score += g_engineOptions.rookCoordinationBonus * sign;

        var kingSq = findKingSquare(p.color);
        var kingR = squareRank(kingSq);
        if (Math.abs(r - kingR) <= 1) score += 3 * sign;
    }

    return score;
}

function evaluateKnights() {
    var score = 0;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece !== PIECE_KNIGHT) continue;

        var f = squareFile(i);
        var r = squareRank(i);
        var sign = p.color === COLOR_WHITE ? 1 : -1;

        if (f === 0 || f === 7 || r === 0 || r === 7) {
            score -= g_engineOptions.knightOnRimPenalty * sign;
        }

        var isOutpost = false;
        if (p.color === COLOR_WHITE && r >= 3 && r <= 5) {
            var protectedByPawn = false;
            // FIXED: White pawns protect from below (they capture upward)
            if (isValidSquare(i - 17) && g_board[i - 17].piece === PIECE_PAWN && g_board[i - 17].color === COLOR_WHITE) protectedByPawn = true;
            if (isValidSquare(i - 15) && g_board[i - 15].piece === PIECE_PAWN && g_board[i - 15].color === COLOR_WHITE) protectedByPawn = true;

            var canBeAttacked = false;
            // FIXED: Black pawns attack downward, so check ABOVE the knight (higher ranks)
            for (var er = r + 1; er < 8; er++) {
                if (f > 0) {
                    var checkSq = makeSquare(f - 1, er);
                    if (g_board[checkSq].piece === PIECE_PAWN && g_board[checkSq].color === COLOR_BLACK) canBeAttacked = true;
                }
                if (f < 7) {
                    var checkSq = makeSquare(f + 1, er);
                    if (g_board[checkSq].piece === PIECE_PAWN && g_board[checkSq].color === COLOR_BLACK) canBeAttacked = true;
                }
            }

            if (protectedByPawn && !canBeAttacked) isOutpost = true;
        } else if (p.color === COLOR_BLACK && r >= 2 && r <= 4) {
            var protectedByPawn = false;
            // FIXED: Black pawns protect from above (they capture downward)
            if (isValidSquare(i + 17) && g_board[i + 17].piece === PIECE_PAWN && g_board[i + 17].color === COLOR_BLACK) protectedByPawn = true;
            if (isValidSquare(i + 15) && g_board[i + 15].piece === PIECE_PAWN && g_board[i + 15].color === COLOR_BLACK) protectedByPawn = true;

            var canBeAttacked = false;
            // FIXED: White pawns attack upward, so check BELOW the knight (lower ranks)
            for (var er = r - 1; er >= 0; er--) {
                if (f > 0) {
                    var checkSq = makeSquare(f - 1, er);
                    if (g_board[checkSq].piece === PIECE_PAWN && g_board[checkSq].color === COLOR_WHITE) canBeAttacked = true;
                }
                if (f < 7) {
                    var checkSq = makeSquare(f + 1, er);
                    if (g_board[checkSq].piece === PIECE_PAWN && g_board[checkSq].color === COLOR_WHITE) canBeAttacked = true;
                }
            }

            if (protectedByPawn && !canBeAttacked) isOutpost = true;
        }

        if (isOutpost) score += g_engineOptions.knightOutpostBonus * sign;

        var protectedByPawn = false;
        if (p.color === COLOR_WHITE) {
            // FIXED: White pawns protect from below
            if (isValidSquare(i - 17) && g_board[i - 17].piece === PIECE_PAWN && g_board[i - 17].color === COLOR_WHITE) protectedByPawn = true;
            if (isValidSquare(i - 15) && g_board[i - 15].piece === PIECE_PAWN && g_board[i - 15].color === COLOR_WHITE) protectedByPawn = true;
        } else {
            // FIXED: Black pawns protect from above
            if (isValidSquare(i + 17) && g_board[i + 17].piece === PIECE_PAWN && g_board[i + 17].color === COLOR_BLACK) protectedByPawn = true;
            if (isValidSquare(i + 15) && g_board[i + 15].piece === PIECE_PAWN && g_board[i + 15].color === COLOR_BLACK) protectedByPawn = true;
        }
        if (protectedByPawn) score += 3 * sign;

        if (f >= 2 && f <= 5 && r >= 2 && r <= 5) score += 5 * sign;
    }

    return score;
}

function evaluateBishops() {
    var score = 0;
    var wBishops = 0, bBishops = 0;
    var wBishopSquares = [], bBishopSquares = [];

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece !== PIECE_BISHOP) continue;
        if (p.color === COLOR_WHITE) { wBishops++; wBishopSquares.push(i); }
        else { bBishops++; bBishopSquares.push(i); }
    }

    if (wBishops >= 2) score += g_engineOptions.bishopPairBonus;
    if (bBishops >= 2) score -= g_engineOptions.bishopPairBonus;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece !== PIECE_BISHOP) continue;
        var sign = p.color === COLOR_WHITE ? 1 : -1;

        var isBadBishop = true;
        var centerColor = (squareFile(i) + squareRank(i)) % 2;
        for (var j = 0; j < 128; j++) {
            if (!isValidSquare(j)) continue;
            var pawn = g_board[j];
            if (pawn.piece === PIECE_PAWN && pawn.color === p.color) {
                if ((squareFile(j) + squareRank(j)) % 2 === centerColor) {
                    isBadBishop = false;
                    break;
                }
            }
        }
        if (isBadBishop && wBishops + bBishops <= 3) {
            score -= g_engineOptions.badBishopPenalty * sign;
        }

        var mobility = 0;
        for (var d = 0; d < 4; d++) {
            var to = i + BISHOP_DELTAS[d];
            while (isValidSquare(to)) {
                if (g_board[to].piece === PIECE_NONE || g_board[to].color !== p.color) mobility++;
                if (g_board[to].piece !== PIECE_NONE) break;
                to += BISHOP_DELTAS[d];
            }
        }
        if (mobility <= 3) score -= g_engineOptions.trappedPiecePenalty * 0.3 * sign;

        var isBehindPawn = false;
        // FIXED: "Behind" means pawn is in front of the minor piece (toward enemy)
        if (p.color === COLOR_WHITE) {
            var checkSq = i + 16;
            if (isValidSquare(checkSq) && g_board[checkSq].piece === PIECE_PAWN && g_board[checkSq].color === COLOR_WHITE) isBehindPawn = true;
        } else {
            var checkSq = i - 16;
            if (isValidSquare(checkSq) && g_board[checkSq].piece === PIECE_PAWN && g_board[checkSq].color === COLOR_BLACK) isBehindPawn = true;
        }
        if (isBehindPawn) score += g_engineOptions.minorBehindPawnBonus * sign;

        if (squareFile(i) >= 2 && squareFile(i) <= 5 && squareRank(i) >= 2 && squareRank(i) <= 5) {
            score += 5 * sign;
        }

        var xrayCount = 0;
        for (var d = 0; d < 4; d++) {
            var to = i + BISHOP_DELTAS[d];
            var ownPieces = 0, enemyPieces = 0;
            while (isValidSquare(to)) {
                if (g_board[to].piece !== PIECE_NONE) {
                    if (g_board[to].color === p.color) ownPieces++;
                    else enemyPieces++;
                    if (enemyPieces > 0 && ownPieces > 0) { xrayCount++; break; }
                    if (enemyPieces > 1) break;
                }
                to += BISHOP_DELTAS[d];
            }
        }
        if (xrayCount > 0) score += g_engineOptions.discoveryThreatBonus * 0.2 * sign * xrayCount;
    }

    return score;
}

function evaluateThreats() {
    var score = 0;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE) continue;
        var sign = p.color === COLOR_WHITE ? 1 : -1;

        var attackers = getAttackingPieces(i, 1 - p.color);
        var defenders = getAttackingPieces(i, p.color);

        if (attackers.length > defenders.length && p.piece !== PIECE_KING) {
            var penalty = HANGING_PIECE_PENALTY[p.piece] || 0;
            if (defenders.length === 0) penalty *= 1.5;
            score -= penalty * sign * g_engineOptions.threatWeight / 5;
        }

        if (p.piece === PIECE_QUEEN && g_gamePhase === GAME_PHASE_OPENING) {
            var r = squareRank(i);
            if (p.color === COLOR_WHITE && r >= 5) score -= g_engineOptions.queenEarlyDevelopmentPenalty * sign;
            if (p.color === COLOR_BLACK && r <= 2) score -= g_engineOptions.queenEarlyDevelopmentPenalty * sign;
        }

        if (p.piece === PIECE_KNIGHT || p.piece === PIECE_BISHOP) {
            var trapped = true;
            for (var j = 0; j < (p.piece === PIECE_KNIGHT ? 8 : 4); j++) {
                var deltas = p.piece === PIECE_KNIGHT ? KNIGHT_DELTAS : BISHOP_DELTAS;
                var to = i + deltas[j];
                if (isValidSquare(to) && (g_board[to].piece === PIECE_NONE || g_board[to].color !== p.color)) {
                    trapped = false;
                    break;
                }
            }
            if (trapped) score -= g_engineOptions.trappedPiecePenalty * sign;
        }
    }

    return score;
}

function evaluateSpace() {
    var score = 0;

    for (var r = 3; r <= 6; r++) {
        for (var f = 2; f <= 5; f++) {
            var sq = makeSquare(f, r);
            if (g_board[sq].piece !== PIECE_NONE) {
                if (g_board[sq].color === COLOR_WHITE) score += 2;
                else score -= 2;
            }

            var wControls = false, bControls = false;
            if (isSquareAttacked(sq, COLOR_WHITE)) wControls = true;
            if (isSquareAttacked(sq, COLOR_BLACK)) bControls = true;
            if (wControls && !bControls) score += 1;
            if (bControls && !wControls) score -= 1;
        }
    }

    for (var r = 2; r <= 5; r++) {
        for (var f = 1; f <= 6; f++) {
            var sq = makeSquare(f, r);
            if (g_board[sq].piece !== PIECE_NONE) {
                if (g_board[sq].color === COLOR_WHITE) score += 1;
                else score -= 1;
            }
        }
    }

    return score * g_engineOptions.spaceWeight / 2;
}

function evaluateKingTropism() {
    var score = 0;
    var wKing = findKingSquare(COLOR_WHITE);
    var bKing = findKingSquare(COLOR_BLACK);
    if (wKing === -1 || bKing === -1) return 0;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE || p.piece === PIECE_PAWN || p.piece === PIECE_KING) continue;

        if (p.color === COLOR_WHITE) {
            var dist = squareDistance(i, bKing);
            score += (7 - dist) * getPieceValue(p.piece) / 1000 * g_engineOptions.kingTropismWeight;
        } else {
            var dist = squareDistance(i, wKing);
            score -= (7 - dist) * getPieceValue(p.piece) / 1000 * g_engineOptions.kingTropismWeight;
        }
    }

    return score;
}

function evaluatePinnedPieces() {
    var score = 0;

    for (var color = 0; color < 2; color++) {
        var kingSq = findKingSquare(color);
        if (kingSq === -1) continue;

        for (var i = 0; i < 128; i++) {
            if (!isValidSquare(i)) continue;
            var p = g_board[i];
            if (p.piece === PIECE_NONE || p.color !== color) continue;
            if (p.piece === PIECE_KING) continue;

            var isPinned = false;
            var kf = squareFile(kingSq), kr = squareRank(kingSq);
            var pf = squareFile(i), pr = squareRank(i);

            var df = pf === kf ? 0 : (pf > kf ? 1 : -1);
            var dr = pr === kr ? 0 : (pr > kr ? 1 : -1);
            if (Math.abs(pf - kf) !== Math.abs(pr - kr) && pf !== kf && pr !== kr) continue;

            var f = pf + df, r = pr + dr;
            while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
                if (f === pf && r === pr) { f += df; r += dr; continue; }
                var sq = makeSquare(f, r);
                if (!isValidSquare(sq)) break;

                if (g_board[sq].piece !== PIECE_NONE) {
                    if (g_board[sq].color !== color) {
                        if ((dr !== 0 && df !== 0 && (g_board[sq].piece === PIECE_BISHOP || g_board[sq].piece === PIECE_QUEEN)) ||
                            (dr === 0 && df !== 0 && (g_board[sq].piece === PIECE_ROOK || g_board[sq].piece === PIECE_QUEEN)) ||
                            (dr !== 0 && df === 0 && (g_board[sq].piece === PIECE_ROOK || g_board[sq].piece === PIECE_QUEEN))) {
                            isPinned = true;
                        }
                    }
                    break;
                }
                f += df; r += dr;
            }

            if (isPinned) {
                if (color === COLOR_WHITE) score -= g_engineOptions.pinnedPiecePenalty * getPieceValue(p.piece) / 500;
                else score += g_engineOptions.pinnedPiecePenalty * getPieceValue(p.piece) / 500;
            }
        }
    }

    return score;
}

function evaluateMaterialImbalance() {
    var score = 0;
    var wKnights = 0, wBishops = 0, wRooks = 0, wQueens = 0;
    var bKnights = 0, bBishops = 0, bRooks = 0, bQueens = 0;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE) continue;
        if (p.color === COLOR_WHITE) {
            if (p.piece === PIECE_KNIGHT) wKnights++;
            if (p.piece === PIECE_BISHOP) wBishops++;
            if (p.piece === PIECE_ROOK) wRooks++;
            if (p.piece === PIECE_QUEEN) wQueens++;
        } else {
            if (p.piece === PIECE_KNIGHT) bKnights++;
            if (p.piece === PIECE_BISHOP) bBishops++;
            if (p.piece === PIECE_ROOK) bRooks++;
            if (p.piece === PIECE_QUEEN) bQueens++;
        }
    }

    if (wKnights === 2 && wBishops === 0 && bKnights <= 1) score += 10;
    if (bKnights === 2 && bBishops === 0 && wKnights <= 1) score -= 10;

    if (wBishops >= 1 && wKnights >= 1) score += 5;
    if (bBishops >= 1 && bKnights >= 1) score -= 5;

    if (wRooks > bRooks && wQueens === bQueens) score += 10 * (wRooks - bRooks);
    if (bRooks > wRooks && wQueens === bQueens) score -= 10 * (bRooks - wRooks);

    var wMinor = wKnights + wBishops;
    var bMinor = bKnights + bBishops;
    if (wMinor > bMinor && wRooks < bRooks) score += 5 * (wMinor - bMinor);
    if (bMinor > wMinor && bRooks < wRooks) score -= 5 * (bMinor - wMinor);

    return score * g_engineOptions.materialImbalanceWeight / 5;
}

function evaluateInitiative() {
    var score = 0;
    var wMobility = 0, bMobility = 0;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE) continue;

        if (p.piece === PIECE_KNIGHT) {
            for (var j = 0; j < 8; j++) {
                var to = i + KNIGHT_DELTAS[j];
                if (isValidSquare(to) && (g_board[to].piece === PIECE_NONE || g_board[to].color !== p.color)) {
                    if (p.color === COLOR_WHITE) wMobility++; else bMobility++;
                }
            }
        } else if (p.piece === PIECE_BISHOP) {
            for (var j = 0; j < 4; j++) {
                var to = i + BISHOP_DELTAS[j];
                while (isValidSquare(to)) {
                    if (g_board[to].piece === PIECE_NONE) {
                        if (p.color === COLOR_WHITE) wMobility++; else bMobility++;
                    } else {
                        if (g_board[to].color !== p.color) {
                            if (p.color === COLOR_WHITE) wMobility++; else bMobility++;
                        }
                        break;
                    }
                    to += BISHOP_DELTAS[j];
                }
            }
        } else if (p.piece === PIECE_ROOK) {
            for (var j = 0; j < 4; j++) {
                var to = i + ROOK_DELTAS[j];
                while (isValidSquare(to)) {
                    if (g_board[to].piece === PIECE_NONE) {
                        if (p.color === COLOR_WHITE) wMobility++; else bMobility++;
                    } else {
                        if (g_board[to].color !== p.color) {
                            if (p.color === COLOR_WHITE) wMobility++; else bMobility++;
                        }
                        break;
                    }
                    to += ROOK_DELTAS[j];
                }
            }
        }
    }

    if (wMobility > bMobility + 10) score += 5;
    if (bMobility > wMobility + 10) score -= 5;

    var wCenterControl = 0, bCenterControl = 0;
    for (var i = 0; i < 4; i++) {
        if (isSquareAttacked(CENTER_SQUARES[i], COLOR_WHITE)) wCenterControl++;
        if (isSquareAttacked(CENTER_SQUARES[i], COLOR_BLACK)) bCenterControl++;
    }
    if (wCenterControl > bCenterControl) score += 3;
    if (bCenterControl > wCenterControl) score -= 3;

    if (g_sideToMove === COLOR_WHITE) score += g_engineOptions.tempoBonus;
    else score -= g_engineOptions.tempoBonus;

    return score * g_engineOptions.initiativeWeight / 5;
}

function evaluateFull() {
    var hash = getPositionHash();
    if (g_evalCache[hash] !== undefined) {
        return g_evalCache[hash];
    }

    updateGamePhase();

    var score = 0;
    score += evaluateMaterial();
    score += evaluatePST();
    score += evaluateMobility();
    score += evaluatePawnStructure();
    score += evaluateKingSafety();
    score += evaluateRooks();
    score += evaluateKnights();
    score += evaluateBishops();
    score += evaluateThreats();
    score += evaluateSpace();
    score += evaluateKingTropism();
    score += evaluatePinnedPieces();
    score += evaluateMaterialImbalance();
    score += evaluateInitiative();

    if (g_engineOptions.contempt !== 0 && g_gamePhase !== GAME_PHASE_ENDGAME) {
        if (g_sideToMove === COLOR_WHITE) score += g_engineOptions.contempt;
        else score -= g_engineOptions.contempt;
    }

    if (g_sideToMove === COLOR_BLACK) score = -score;

    g_evalCache[hash] = score;
    return score;
}

function evaluate() {
    return evaluateFull();
}

function resizeTranspositionTable() {
    var maxEntries = (g_engineOptions.hashSizeMB * 1024 * 1024) / 32;
    g_ttSize = Math.floor(maxEntries);
    g_transpositionTable = {};
}

function clearTranspositionTable() {
    g_transpositionTable = {};
}

function probeTranspositionTable(hash, depth, alpha, beta) {
    var entry = g_transpositionTable[hash];
    if (entry && entry.depth >= depth) {
        g_searchStats.tthits++;
        if (entry.flag === TT_EXACT) {
            return {score: entry.score, move: entry.move, hit: true};
        } else if (entry.flag === TT_ALPHA && entry.score <= alpha) {
            g_searchStats.ttcuts++;
            return {score: alpha, move: entry.move, hit: true};
        } else if (entry.flag === TT_BETA && entry.score >= beta) {
            g_searchStats.ttcuts++;
            return {score: beta, move: entry.move, hit: true};
        }
    }
    return {score: 0, move: null, hit: false};
}

function storeTranspositionTable(hash, depth, score, flag, move) {
    var existing = g_transpositionTable[hash];
    if (existing && existing.depth > depth + 2) return;
    g_transpositionTable[hash] = {
        depth: depth,
        score: score,
        flag: flag,
        move: move,
        age: g_fullMoveNumber
    };
}

function scoreMove(move, hash, ply) {
    var score = 0;

    if (move.captured !== PIECE_NONE) {
        var seeVal = SEE_PIECE_VALUES[move.captured] * 10 - SEE_PIECE_VALUES[move.piece];
        score += 100000 + seeVal;
    }

    if (move.promotion !== PIECE_NONE) {
        score += 90000 + getPieceValue(move.promotion);
    }

    var ttEntry = g_transpositionTable[hash];
    if (ttEntry && ttEntry.move && movesEqual(move, ttEntry.move)) {
        score += 200000;
    }

    if (ply < MAX_PLY) {
        if (g_killerMoves[ply][0] && movesEqual(move, g_killerMoves[ply][0])) {
            score += 80000;
        } else if (g_killerMoves[ply][1] && movesEqual(move, g_killerMoves[ply][1])) {
            score += 70000;
        }
    }

    var historyScore = g_historyTable[g_sideToMove][move.from + "-" + move.to];
    if (historyScore) {
        score += Math.min(historyScore, 60000);
    }

    var counterMove = null;
    if (g_moveHistory.length > 0) {
        var lastMove = g_moveHistory[g_moveHistory.length - 1].move;
        if (lastMove) {
            var counterKey = lastMove.from + "-" + lastMove.to;
            counterMove = g_counterMoves[1 - g_sideToMove][counterKey];
        }
    }
    if (counterMove && movesEqual(move, counterMove)) {
        score += 65000;
    }

    return score;
}

function orderMoves(moves, hash, ply) {
    for (var i = 0; i < moves.length; i++) {
        moves[i].score = scoreMove(moves[i], hash, ply);
    }
    moves.sort(function(a, b) { return b.score - a.score; });
}

function updateKillerMoves(move, ply) {
    if (move.captured !== PIECE_NONE) return;
    if (ply >= MAX_PLY) return;
    if (!g_killerMoves[ply][0] || !movesEqual(move, g_killerMoves[ply][0])) {
        g_killerMoves[ply][1] = g_killerMoves[ply][0];
        g_killerMoves[ply][0] = cloneMove(move);
    }
}

function updateHistory(move, depth, side) {
    if (move.captured !== PIECE_NONE) return;
    var key = move.from + "-" + move.to;
    if (!g_historyTable[side][key]) g_historyTable[side][key] = 0;
    var bonus = depth * depth;
    g_historyTable[side][key] += bonus;
    if (g_historyTable[side][key] > 1000000) {
        for (var k in g_historyTable[side]) {
            g_historyTable[side][k] = Math.floor(g_historyTable[side][k] / 2);
        }
    }
}

function updateCounterMove(move, side) {
    if (g_moveHistory.length === 0) return;
    var lastMove = g_moveHistory[g_moveHistory.length - 1].move;
    if (!lastMove) return;
    var key = lastMove.from + "-" + lastMove.to;
    g_counterMoves[side][key] = cloneMove(move);
}

function isDraw() {
    if (g_halfMoveClock >= 100) return true;
    if (isInsufficientMaterial()) return true;
    if (isThreefoldRepetition()) return true;
    return false;
}

function isInsufficientMaterial() {
    var wPieces = [], bPieces = [];

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE || p.piece === PIECE_KING) continue;
        if (p.color === COLOR_WHITE) wPieces.push(p.piece);
        else bPieces.push(p.piece);
    }

    if (wPieces.length === 0 && bPieces.length === 0) return true;
    if (wPieces.length === 0 && bPieces.length === 1 && (bPieces[0] === PIECE_KNIGHT || bPieces[0] === PIECE_BISHOP)) return true;
    if (bPieces.length === 0 && wPieces.length === 1 && (wPieces[0] === PIECE_KNIGHT || wPieces[0] === PIECE_BISHOP)) return true;
    if (wPieces.length === 1 && bPieces.length === 1 && wPieces[0] === PIECE_BISHOP && bPieces[0] === PIECE_BISHOP) {
        var wSqColor = -1, bSqColor = -1;
        for (var i = 0; i < 128; i++) {
            if (!isValidSquare(i)) continue;
            var p = g_board[i];
            if (p.piece === PIECE_BISHOP) {
                var color = (squareFile(i) + squareRank(i)) % 2;
                if (p.color === COLOR_WHITE) wSqColor = color;
                else bSqColor = color;
            }
        }
        if (wSqColor === bSqColor) return true;
    }
    if (wPieces.length === 2 && bPieces.length === 0) {
        if (wPieces[0] === PIECE_KNIGHT && wPieces[1] === PIECE_KNIGHT) return true;
    }
    if (bPieces.length === 2 && wPieces.length === 0) {
        if (bPieces[0] === PIECE_KNIGHT && bPieces[1] === PIECE_KNIGHT) return true;
    }

    return false;
}

function isThreefoldRepetition() {
    var currentHash = getPositionHash();
    var count = 0;
    for (var i = 0; i < g_positionHistory.length; i++) {
        if (g_positionHistory[i] === currentHash) {
            count++;
            if (count >= 2) return true;
        }
    }
    return false;
}

function repetitionCount() {
    var currentHash = getPositionHash();
    var count = 0;
    for (var i = 0; i < g_positionHistory.length; i++) {
        if (g_positionHistory[i] === currentHash) count++;
    }
    return count;
}

function moveToString(move) {
    if (!move || (move.from === 0 && move.to === 0)) return "0000";
    var fromFile = String.fromCharCode(97 + (move.from & 7));
    var fromRank = (move.from >> 4) + 1;
    var toFile = String.fromCharCode(97 + (move.to & 7));
    var toRank = (move.to >> 4) + 1;
    var str = fromFile + fromRank + toFile + toRank;
    if (move.promotion !== PIECE_NONE) {
        switch (move.promotion) {
            case PIECE_QUEEN: str += "q"; break;
            case PIECE_ROOK: str += "r"; break;
            case PIECE_BISHOP: str += "b"; break;
            case PIECE_KNIGHT: str += "n"; break;
        }
    }
    return str;
}

function moveToSAN(move) {
    if (move.flags & FLAG_CASTLING) {
        if (move.to > move.from) return "O-O";
        return "O-O-O";
    }

    var pieceChars = " PNBRQK";
    var san = "";
    if (move.piece !== PIECE_PAWN) san += pieceChars[move.piece];

    var fromFile = String.fromCharCode(97 + (move.from & 7));
    var fromRank = (move.from >> 4) + 1;
    var toFile = String.fromCharCode(97 + (move.to & 7));
    var toRank = (move.to >> 4) + 1;

    if (move.piece === PIECE_PAWN) {
        if (move.captured !== PIECE_NONE || move.flags & FLAG_ENPASSANT) {
            san += fromFile + "x";
        }
        san += toFile + toRank;
        if (move.promotion !== PIECE_NONE) {
            san += "=" + pieceChars[move.promotion].toLowerCase();
        }
    } else {
        var ambiguous = false;
        var sameFile = false;
        var sameRank = false;

        for (var i = 0; i < 128; i++) {
            if (!isValidSquare(i)) continue;
            var p = g_board[i];
            if (p.piece !== move.piece || p.color !== g_sideToMove || i === move.from) continue;

            makeMove(createMove(i, move.to, move.piece, g_board[move.to].piece, move.promotion, move.flags));
            var wasLegal = !isInCheck(g_sideToMove);
            undoMove();

            if (wasLegal) {
                ambiguous = true;
                if (squareFile(i) === squareFile(move.from)) sameFile = true;
                if (squareRank(i) === squareRank(move.from)) sameRank = true;
            }
        }

        if (ambiguous) {
            if (!sameFile) san += fromFile;
            else if (!sameRank) san += fromRank;
            else san += fromFile + fromRank;
        }

        if (move.captured !== PIECE_NONE) san += "x";
        san += toFile + toRank;
    }

    makeMove(move);
    if (isCheckmate(1 - g_sideToMove)) san += "#";
    else if (isInCheck(1 - g_sideToMove)) san += "+";
    undoMove();

    return san;
}

function stringToMove(str) {
    if (str.length < 4) return null;
    var fromFile = str.charCodeAt(0) - 97;
    var fromRank = parseInt(str[1]) - 1;
    var toFile = str.charCodeAt(2) - 97;
    var toRank = parseInt(str[3]) - 1;
    var from = (fromRank << 4) | fromFile;
    var to = (toRank << 4) | toFile;
    var promotion = PIECE_NONE;
    if (str.length > 4) {
        switch (str[4]) {
            case "q": promotion = PIECE_QUEEN; break;
            case "r": promotion = PIECE_ROOK; break;
            case "b": promotion = PIECE_BISHOP; break;
            case "n": promotion = PIECE_KNIGHT; break;
        }
    }

    var moves = generateLegalMoves(g_sideToMove);
    for (var i = 0; i < moves.length; i++) {
        if (moves[i].from === from && moves[i].to === to && moves[i].promotion === promotion) {
            return moves[i];
        }
    }
    return null;
}

function handlePosition(cmd) {
    var tokens = cmd.split(/\s+/);
    var idx = 1;

    if (tokens[idx] === "startpos") {
        setFEN(INITIAL_FEN);
        idx++;
    } else if (tokens[idx] === "fen") {
        idx++;
        var fenParts = [];
        while (idx < tokens.length && tokens[idx] !== "moves") {
            fenParts.push(tokens[idx]);
            idx++;
        }
        setFEN(fenParts.join(" "));
    }

    g_positionHistory = [];

    if (idx < tokens.length && tokens[idx] === "moves") {
        idx++;
        while (idx < tokens.length) {
            var move = stringToMove(tokens[idx]);
            if (move) {
                makeMove(move);
                g_positionHistory.push(getPositionHash());
            }
            idx++;
        }
    }
}

function setFEN(fen) {
    var parts = fen.split(/\s+/);

    for (var i = 0; i < 128; i++) {
        g_board[i] = {piece: PIECE_NONE, color: -1};
    }

    var placement = parts[0];
    var rank = 7;
    var file = 0;

    for (var i = 0; i < placement.length; i++) {
        var ch = placement[i];
        if (ch === "/") {
            rank--;
            file = 0;
        } else if (ch >= "1" && ch <= "8") {
            file += parseInt(ch);
        } else {
            var piece = PIECE_NONE;
            var color = COLOR_WHITE;
            var lower = ch.toLowerCase();
            if (lower === "p") piece = PIECE_PAWN;
            else if (lower === "n") piece = PIECE_KNIGHT;
            else if (lower === "b") piece = PIECE_BISHOP;
            else if (lower === "r") piece = PIECE_ROOK;
            else if (lower === "q") piece = PIECE_QUEEN;
            else if (lower === "k") piece = PIECE_KING;
            if (ch >= "a" && ch <= "z") color = COLOR_BLACK;
            if (piece !== PIECE_NONE) {
                g_board[makeSquare(file, rank)] = {piece: piece, color: color};
                file++;
            }
        }
    }

    g_sideToMove = parts[1] === "w" ? COLOR_WHITE : COLOR_BLACK;
    g_castlingRights = 0;
    if (parts[2]) {
        if (parts[2].indexOf("K") !== -1) g_castlingRights |= CASTLE_WK;
        if (parts[2].indexOf("Q") !== -1) g_castlingRights |= CASTLE_WQ;
        if (parts[2].indexOf("k") !== -1) g_castlingRights |= CASTLE_BK;
        if (parts[2].indexOf("q") !== -1) g_castlingRights |= CASTLE_BQ;
    }

    g_enPassantSquare = -1;
    if (parts[3] && parts[3] !== "-") {
        var epFile = parts[3].charCodeAt(0) - 97;
        var epRank = parseInt(parts[3][1]) - 1;
        g_enPassantSquare = makeSquare(epFile, epRank);
    }

    g_halfMoveClock = parts[4] ? parseInt(parts[4]) : 0;
    g_fullMoveNumber = parts[5] ? parseInt(parts[5]) : 1;
    updateGamePhase();
}

function getFEN() {
    var fen = "";
    for (var rank = 7; rank >= 0; rank--) {
        var emptyCount = 0;
        for (var file = 0; file < 8; file++) {
            var sq = makeSquare(file, rank);
            var piece = g_board[sq];
            if (piece.piece === PIECE_NONE) {
                emptyCount++;
            } else {
                if (emptyCount > 0) { fen += emptyCount; emptyCount = 0; }
                var ch = g_pieceToChar[piece.piece];
                if (piece.color === COLOR_WHITE) ch = ch.toUpperCase();
                fen += ch;
            }
        }
        if (emptyCount > 0) fen += emptyCount;
        if (rank > 0) fen += "/";
    }

    fen += " ";
    fen += g_sideToMove === COLOR_WHITE ? "w" : "b";
    fen += " ";

    var castling = "";
    if (g_castlingRights & CASTLE_WK) castling += "K";
    if (g_castlingRights & CASTLE_WQ) castling += "Q";
    if (g_castlingRights & CASTLE_BK) castling += "k";
    if (g_castlingRights & CASTLE_BQ) castling += "q";
    if (castling === "") castling = "-";
    fen += castling;
    fen += " ";

    if (g_enPassantSquare !== -1) {
        var coords = {file: squareFile(g_enPassantSquare), rank: squareRank(g_enPassantSquare)};
        fen += String.fromCharCode(97 + coords.file) + (coords.rank + 1);
    } else {
        fen += "-";
    }
    fen += " ";
    fen += g_halfMoveClock;
    fen += " ";
    fen += g_fullMoveNumber;

    return fen;
}

function handlePonderHit() {
    g_isPondering = false;
    g_ponderHit = true;
}

function handleGo(cmd) {
    var tokens = cmd.split(/\s+/);
    var depth = 64;
    var timeLimit = null;
    var wtime = null, btime = null;
    var winc = 0, binc = 0;
    var movesToGo = null;
    var moveTime = null;
    var infinite = false;
    var ponder = false;

    for (var i = 1; i < tokens.length; i++) {
        switch (tokens[i]) {
            case "depth": depth = parseInt(tokens[i + 1]) || 64; i++; break;
            case "wtime": wtime = parseInt(tokens[i + 1]); i++; break;
            case "btime": btime = parseInt(tokens[i + 1]); i++; break;
            case "winc": winc = parseInt(tokens[i + 1]) || 0; i++; break;
            case "binc": binc = parseInt(tokens[i + 1]) || 0; i++; break;
            case "movestogo": movesToGo = parseInt(tokens[i + 1]); i++; break;
            case "movetime": moveTime = parseInt(tokens[i + 1]); i++; break;
            case "infinite": infinite = true; depth = 128; break;
            case "ponder": ponder = true; break;
            case "nodes": break;
            case "mate": break;
            case "searchmoves": break;
        }
    }

    if (moveTime !== null) {
        timeLimit = moveTime;
    } else if (timeLimit === null && !infinite) {
        var myTime = g_sideToMove === COLOR_WHITE ? wtime : btime;
        var myInc = g_sideToMove === COLOR_WHITE ? winc : binc;

        if (myTime !== null && myTime !== undefined) {
            var baseTime = myTime * (g_engineOptions.slowMover / 100);
            if (movesToGo && movesToGo > 0) {
                timeLimit = Math.floor(baseTime / movesToGo) + myInc;
            } else {
                timeLimit = Math.floor(baseTime / 30) + myInc;
            }
            var maxTime = Math.floor(myTime * 0.4);
            if (timeLimit > maxTime) timeLimit = maxTime;
            if (timeLimit < g_engineOptions.minimumThinkingTime) timeLimit = g_engineOptions.minimumThinkingTime;
            if (myTime > 0 && timeLimit > myTime - g_engineOptions.emergencyTimeBuffer) {
                timeLimit = Math.max(100, myTime - g_engineOptions.emergencyTimeBuffer);
            }
        } else {
            timeLimit = 5000;
        }
    }

    if (g_engineOptions.skillLevel < 20 && !infinite) {
        depth = Math.max(1, Math.floor(depth * g_engineOptions.skillLevel / 20));
    }

    if (g_engineOptions.analyzeMode) {
        infinite = true;
        g_engineOptions.ponderEnabled = false;
    }

    if (ponder && g_engineOptions.ponderEnabled) {
        g_isPondering = true;
        g_ponderHit = false;
    }

    setTimeout(function() {
        var bestMove = iterativeDeepening(depth, timeLimit, infinite);
        var ponderMove = null;
        if (bestMove) {
            makeMove(bestMove);
            var legalMoves = generateLegalMoves(g_sideToMove);
            if (legalMoves.length > 0) {
                orderMoves(legalMoves, getPositionHash(), 0);
                ponderMove = legalMoves[0];
            }
            undoMove();
        }
        g_isSearching = false;
        g_isPondering = false;
        sendBestMove(moveToString(bestMove), moveToString(ponderMove));
    }, 0);
}

function iterativeDeepening(maxDepth, timeLimit, infinite) {
    g_stopSearch = false;
    g_searchNodes = 0;
    g_searchStartTime = Date.now();
    g_isSearching = true;
    g_bestMoveChanges = 0;
    g_stableBestMoveCount = 0;
    g_searchStats = {
        nodes: 0, qnodes: 0, tthits: 0, ttcuts: 0,
        nullCuts: 0, lmrReductions: 0, futilityPrunes: 0,
        razorPrunes: 0, extensions: 0, checkExtensions: 0,
        singularExtensions: 0, aspirationResearches: 0, nps: 0
    };

    for (var i = 0; i < MAX_PLY; i++) {
        g_killerMoves[i] = [{from: 0, to: 0}, {from: 0, to: 0}];
        g_searchStack[i] = {
            pv: [], staticEval: 0, killers: [{from: 0, to: 0}, {from: 0, to: 0}],
            currentMove: null, excludedMove: null, inCheck: false, moveCount: 0
        };
    }

    if (g_engineOptions.cleanSearch) {
        g_historyTable = [{}, {}];
        g_counterMoves = [{}, {}];
    }

    var bestMove = null;
    var bestScore = 0;
    var aspirationWindow = g_engineOptions.aspirationWindow;
    var aspirationMinDepth = g_engineOptions.aspirationWindowMinDepth;

    for (var depth = 1; depth <= maxDepth; depth++) {
        if (g_stopSearch && !infinite) break;
        if (shouldStopTime(timeLimit) && !infinite && depth > 1) break;

        g_currentDepth = depth;
        g_selDepth = 0;

        var alpha = -VALUE_INFINITE;
        var beta = VALUE_INFINITE;

        if (depth >= aspirationMinDepth) {
            alpha = bestScore - aspirationWindow;
            beta = bestScore + aspirationWindow;
        }

        var result = alphaBetaRoot(depth, alpha, beta);

        if (g_stopSearch && !infinite && !result.move) break;

        if (result.score <= alpha || result.score >= beta) {
            if (!g_stopSearch || infinite) {
                g_searchStats.aspirationResearches++;
                alpha = -VALUE_INFINITE;
                beta = VALUE_INFINITE;
                result = alphaBetaRoot(depth, alpha, beta);
            }
        }

        if (g_stopSearch && !infinite && !result.move) break;

        if (result.move) {
            bestMove = result.move;
            bestScore = result.score;
            g_currentPV = result.pv || [bestMove];
            g_currentScore = bestScore;

            if (!g_previousBestMove || !movesEqual(bestMove, g_previousBestMove)) {
                g_bestMoveChanges++;
                g_stableBestMoveCount = 0;
                g_previousBestMove = cloneMove(bestMove);
            } else {
                g_stableBestMoveCount++;
            }

            var elapsed = Date.now() - g_searchStartTime;
            var nps = elapsed > 0 ? Math.floor(g_searchNodes / (elapsed / 1000)) : 0;
            g_searchStats.nps = nps;

            var scoreStr = bestScore;
            var isMate = false;
            if (Math.abs(bestScore) > VALUE_MATE - MAX_PLY) {
                var mateDist = bestScore > 0 ? Math.floor((VALUE_MATE - bestScore + 1) / 2) : -Math.floor((VALUE_MATE + bestScore) / 2);
                scoreStr = "mate " + mateDist;
                isMate = true;
            } else {
                scoreStr = "cp " + bestScore;
            }

            var pvStr = "";
            if (g_currentPV && g_currentPV.length > 0) {
                for (var j = 0; j < g_currentPV.length; j++) {
                    if (j > 0) pvStr += " ";
                    pvStr += moveToString(g_currentPV[j]);
                }
            } else {
                pvStr = moveToString(bestMove);
            }

            var infoStr = "depth " + depth + " seldepth " + g_selDepth + " score " + scoreStr +
                " nodes " + g_searchNodes + " time " + elapsed + " nps " + nps;
            if (g_currentPV && g_currentPV.length > 0) {
                infoStr += " pv " + pvStr;
            }
            sendInfo(infoStr);

            if (g_engineOptions.verboseUCI) {
                sendInfoString("Depth " + depth + ": " + (isMate ? "M" + Math.floor((VALUE_MATE - Math.abs(bestScore)) / 2) : bestScore) +
                    " | " + moveToString(bestMove) + " | " + pvStr);
            }
        }

        if (!infinite && timeLimit) {
            var elapsed = Date.now() - g_searchStartTime;
            var timeUsage = elapsed / timeLimit;
            if (g_stableBestMoveCount >= 3 && depth >= 8 && timeUsage > 0.5) break;
            if (g_stableBestMoveCount >= 5 && depth >= 12 && timeUsage > 0.3) break;
        }
    }

    g_lastBestMove = bestMove ? cloneMove(bestMove) : null;
    return bestMove;
}

function alphaBetaRoot(depth, alpha, beta) {
    var hash = getPositionHash();
    var inCheck = isInCheck(g_sideToMove);
    if (inCheck) depth++;

    var moves = generateLegalMoves(g_sideToMove);
    if (moves.length === 0) {
        if (inCheck) return {score: -VALUE_MATE, move: null, pv: []};
        return {score: g_engineOptions.drawScore, move: null, pv: []};
    }

    orderMoves(moves, hash, 0);

    var bestScore = -VALUE_INFINITE;
    var bestMove = null;
    var bestPV = [];

    for (var i = 0; i < moves.length; i++) {
        if (g_stopSearch) break;

        var move = moves[i];
        makeMove(move);
        g_searchStack[0].currentMove = move;

        var score;
        if (i === 0) {
            var result = alphaBeta(1, depth - 1, -beta, -alpha, true, true);
            score = -result.score;
        } else {
            var lmrDepth = depth - 1;
            var doFullSearch = true;

            if (depth >= g_engineOptions.lmrDepthThreshold &&
                i >= g_engineOptions.lmrMoveCountThreshold &&
                !inCheck && move.captured === PIECE_NONE && move.promotion === PIECE_NONE) {
                var reduction = LMR_REDUCTION_TABLE[Math.min(depth, 63)][Math.min(i, 63)];
                if (reduction > 0) {
                    var result = alphaBeta(1, lmrDepth - reduction, -alpha - 1, -alpha, false, false);
                    score = -result.score;
                    if (score <= alpha) {
                        doFullSearch = false;
                    }
                    g_searchStats.lmrReductions++;
                }
            }

            if (doFullSearch) {
                var result = alphaBeta(1, lmrDepth, -alpha - 1, -alpha, false, false);
                score = -result.score;
                if (score > alpha && score < beta) {
                    result = alphaBeta(1, lmrDepth, -beta, -alpha, true, true);
                    score = -result.score;
                }
            }
        }

        undoMove();
        g_searchNodes++;
        g_searchStats.nodes++;

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
            bestPV = [move];
            if (i === 0 && g_searchStack[1] && g_searchStack[1].pv) {
                bestPV = bestPV.concat(g_searchStack[1].pv);
            }

            if (score > alpha) {
                alpha = score;
                if (score >= beta) {
                    updateKillerMoves(move, 0);
                    updateHistory(move, depth, g_sideToMove);
                    updateCounterMove(move, g_sideToMove);
                    storeTranspositionTable(hash, depth, beta, TT_BETA, move);
                    return {score: beta, move: move, pv: [move]};
                }
            }
        }
    }

    if (bestMove) {
        var flag = bestScore >= beta ? TT_BETA : (bestScore > alpha ? TT_EXACT : TT_ALPHA);
        storeTranspositionTable(hash, depth, bestScore, flag, bestMove);
    }

    return {score: bestScore, move: bestMove, pv: bestPV};
}

function alphaBeta(ply, depth, alpha, beta, isPV, allowNull) {
    g_searchNodes++;
    g_searchStats.nodes++;
    if (ply > g_selDepth) g_selDepth = ply;

    if (ply >= MAX_PLY - 1) {
        return {score: evaluate(), pv: []};
    }

    if (g_searchNodes % 1024 === 0) {
        if (g_stopSearch) return {score: alpha, pv: []};
    }

    if (isDraw()) {
        return {score: g_engineOptions.drawScore, pv: []};
    }

    var hash = getPositionHash();

    if (!isPV && g_moveHistory.length > 0) {
        var ttResult = probeTranspositionTable(hash, depth, alpha, beta);
        if (ttResult.hit) {
            return {score: ttResult.score, pv: ttResult.move ? [ttResult.move] : []};
        }
    }

    var inCheck = isInCheck(g_sideToMove);

    if (inCheck) {
        depth++;
        g_searchStats.checkExtensions++;
    }

    if (depth <= 0) {
        var qScore = quiescence(ply, alpha, beta, 0);
        return {score: qScore, pv: []};
    }

    var moves = generateLegalMoves(g_sideToMove);
    if (moves.length === 0) {
        if (inCheck) return {score: -VALUE_MATE + ply, pv: []};
        return {score: g_engineOptions.drawScore, pv: []};
    }

    if (moves.length === 1 && ply > 0) {
        depth++;
        g_searchStats.extensions++;
    }

    var staticEval = evaluate();
    g_searchStack[ply].staticEval = staticEval;

    if (!isPV && !inCheck && allowNull && depth >= g_engineOptions.nullMoveDepthLimit) {
        if (staticEval >= beta && hasNonPawnMaterial(g_sideToMove)) {
            var nullR = g_engineOptions.nullMoveReduction;
            if (depth > 6) nullR = 4;
            var nullDepth = depth - nullR - 1;

            if (nullDepth > 0) {
                makeNullMove();
                var nullResult = alphaBeta(ply + 1, nullDepth, -beta, -beta + 1, false, false);
                undoNullMove();
                var nullScore = -nullResult.score;

                if (nullScore >= beta) {
                    g_searchStats.nullCuts++;
                    if (nullScore >= VALUE_MATE - MAX_PLY) nullScore = beta;
                    return {score: beta, pv: []};
                }
            }
        }
    }

    if (!isPV && !inCheck) {
        if (depth <= g_engineOptions.razorDepthLimit && Math.abs(beta) < VALUE_MATE - MAX_PLY) {
            var razorMargin = RAZOR_MARGIN_TABLE[Math.min(depth, 3)] || 300;
            if (staticEval + razorMargin < beta) {
                var qScore = quiescence(ply, alpha, beta, 0);
                g_searchStats.razorPrunes++;
                if (qScore < beta) {
                    return {score: qScore, pv: []};
                }
            }
        }

        if (depth <= g_engineOptions.futilityDepthLimit && Math.abs(alpha) < VALUE_MATE - MAX_PLY) {
            var futilityMargin = FUTILITY_MARGIN_TABLE[Math.min(depth, 3)] || (g_engineOptions.futilityMargin * depth);
            if (staticEval - futilityMargin >= beta && hasNonPawnMaterial(g_sideToMove)) {
                g_searchStats.futilityPrunes++;
                return {score: beta, pv: []};
            }
        }
    }

    orderMoves(moves, hash, ply);

    var bestScore = -VALUE_INFINITE;
    var bestMove = null;
    var bestPV = [];
    var flag = TT_ALPHA;
    var movesSearched = 0;

    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        makeMove(move);
        g_searchStack[ply].currentMove = move;
        g_searchStack[ply].moveCount = movesSearched;

        var score;
        var newDepth = depth - 1;

        if (!isPV && !inCheck && depth >= g_engineOptions.lmrDepthThreshold &&
            movesSearched >= g_engineOptions.lmrMoveCountThreshold &&
            move.captured === PIECE_NONE && move.promotion === PIECE_NONE) {
            var reduction = LMR_REDUCTION_TABLE[Math.min(depth, 63)][Math.min(movesSearched, 63)];
            if (isPV) reduction = Math.max(0, reduction - 1);

            if (reduction > 0) {
                var lmrResult = alphaBeta(ply + 1, newDepth - reduction, -alpha - 1, -alpha, false, true);
                score = -lmrResult.score;
                if (score > alpha) {
                    lmrResult = alphaBeta(ply + 1, newDepth, -alpha - 1, -alpha, false, true);
                    score = -lmrResult.score;
                }
                g_searchStats.lmrReductions++;
            } else {
                var result = alphaBeta(ply + 1, newDepth, -beta, -alpha, isPV, true);
                score = -result.score;
            }
        } else {
            if (i === 0) {
                var result = alphaBeta(ply + 1, newDepth, -beta, -alpha, isPV, true);
                score = -result.score;
            } else {
                var result = alphaBeta(ply + 1, newDepth, -alpha - 1, -alpha, false, true);
                score = -result.score;
                if (score > alpha && score < beta) {
                    result = alphaBeta(ply + 1, newDepth, -beta, -alpha, true, true);
                    score = -result.score;
                }
            }
        }

        undoMove();
        movesSearched++;

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
            bestPV = [move];
            if (g_searchStack[ply + 1] && g_searchStack[ply + 1].pv) {
                bestPV = bestPV.concat(g_searchStack[ply + 1].pv);
            }

            if (score > alpha) {
                alpha = score;
                flag = TT_EXACT;
                g_searchStack[ply].pv = [move];
                if (g_searchStack[ply + 1] && g_searchStack[ply + 1].pv) {
                    g_searchStack[ply].pv = g_searchStack[ply].pv.concat(g_searchStack[ply + 1].pv);
                }

                if (score >= beta) {
                    flag = TT_BETA;
                    if (move.captured === PIECE_NONE) {
                        updateKillerMoves(move, ply);
                        updateHistory(move, depth, g_sideToMove);
                        updateCounterMove(move, g_sideToMove);
                    }
                    storeTranspositionTable(hash, depth, bestScore, flag, move);
                    return {score: bestScore, pv: [move]};
                }
            }
        }
    }

    storeTranspositionTable(hash, depth, bestScore, flag, bestMove);
    return {score: bestScore, pv: bestPV.length > 0 ? bestPV : g_searchStack[ply].pv};
}

function quiescence(ply, alpha, beta, qDepth) {
    g_searchNodes++;
    g_searchStats.qnodes++;

    if (ply >= MAX_PLY - 1) return evaluate();
    if (qDepth > g_engineOptions.selectiveDepth) return evaluate();

    var standPat = evaluate();

    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;

    var delta = g_pieceValues.queen;
    if (standPat + delta < alpha) return alpha;

    var moves = generateLegalMoves(g_sideToMove);
    var captures = [];
    for (var i = 0; i < moves.length; i++) {
        if (moves[i].captured !== PIECE_NONE || moves[i].promotion !== PIECE_NONE || moves[i].flags & FLAG_ENPASSANT) {
            captures.push(moves[i]);
        }
    }

    if (captures.length === 0) {
        if (isInCheck(g_sideToMove)) {
            var evasions = generateEvasions(g_sideToMove);
            if (evasions.length === 0) return -VALUE_MATE + ply;

            for (var i = 0; i < evasions.length; i++) {
                makeMove(evasions[i]);
                var score = -quiescence(ply + 1, -beta, -alpha, qDepth + 1);
                undoMove();
                if (score >= beta) return beta;
                if (score > alpha) alpha = score;
            }
        }
        return alpha;
    }

    captures.sort(function(a, b) {
        var scoreA = getPieceValue(a.captured) * 10 - getPieceValue(a.piece);
        var scoreB = getPieceValue(b.captured) * 10 - getPieceValue(b.piece);
        if (a.promotion !== PIECE_NONE) scoreA += getPieceValue(a.promotion) * 5;
        if (b.promotion !== PIECE_NONE) scoreB += getPieceValue(b.promotion) * 5;
        return scoreB - scoreA;
    });

    for (var i = 0; i < captures.length; i++) {
        var move = captures[i];

        if (move.captured !== PIECE_NONE) {
            var futile = standPat + getPieceValue(move.captured) + 200 < alpha;
            if (futile && move.promotion === PIECE_NONE && !isInCheck(1 - g_sideToMove)) {
                continue;
            }
        }

        makeMove(move);
        var score = -quiescence(ply + 1, -beta, -alpha, qDepth + 1);
        undoMove();

        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
    }

    return alpha;
}

function hasNonPawnMaterial(color) {
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece !== PIECE_NONE && p.piece !== PIECE_PAWN && p.piece !== PIECE_KING && p.color === color) {
            return true;
        }
    }
    return false;
}

function hasMajorPieces(color) {
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if ((p.piece === PIECE_ROOK || p.piece === PIECE_QUEEN) && p.color === color) {
            return true;
        }
    }
    return false;
}

function countMaterial(color) {
    var material = 0;
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece !== PIECE_NONE && p.piece !== PIECE_KING && p.color === color) {
            material += getPieceValue(p.piece);
        }
    }
    return material;
}

function shouldStopTime(timeLimit) {
    if (!timeLimit) return false;
    var elapsed = Date.now() - g_searchStartTime;
    return elapsed >= timeLimit;
}

function getTimeUsed() {
    return Date.now() - g_searchStartTime;
}

function pickRandomMove(moves) {
    var weights = [];
    for (var i = 0; i < moves.length; i++) {
        weights.push(moves[i].score || (moves.length - i));
    }
    var total = 0;
    for (var i = 0; i < weights.length; i++) total += weights[i];
    var random = Math.random() * total;
    var cumulative = 0;
    for (var i = 0; i < moves.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) return moves[i];
    }
    return moves[0];
}

function applySkillLevel(bestMove, allMoves, depth) {
    if (g_engineOptions.skillLevel >= 20) return bestMove;
    if (!bestMove || allMoves.length <= 1) return bestMove;

    var probability = g_engineOptions.skillLevel / 20;
    var blunderChance = (1 - probability) * (1 - probability);

    if (Math.random() < blunderChance && allMoves.length > 1) {
        var weakMoves = allMoves.slice(1);
        var idx = Math.floor(Math.random() * Math.min(weakMoves.length, 3));
        return weakMoves[idx] || bestMove;
    }

    if (Math.random() > probability && allMoves.length > 1) {
        var idx = Math.floor(Math.random() * Math.min(allMoves.length, 2));
        return allMoves[idx] || bestMove;
    }

    return bestMove;
}

function perft(depth) {
    if (depth === 0) return 1;
    var moves = generateLegalMoves(g_sideToMove);
    if (depth === 1) return moves.length;
    var nodes = 0;
    for (var i = 0; i < moves.length; i++) {
        makeMove(moves[i]);
        nodes += perft(depth - 1);
        undoMove();
    }
    return nodes;
}

function divide(depth) {
    var moves = generateLegalMoves(g_sideToMove);
    var total = 0;
    for (var i = 0; i < moves.length; i++) {
        makeMove(moves[i]);
        var nodes = perft(depth - 1);
        undoMove();
        sendInfoString(moveToString(moves[i]) + ": " + nodes);
        total += nodes;
    }
    sendInfoString("Total: " + total);
    return total;
}

function runPerft(depth) {
    var start = Date.now();
    var nodes = perft(depth);
    var elapsed = Date.now() - start;
    sendInfoString("Perft(" + depth + ") = " + nodes + " (" + elapsed + "ms, " +
        (elapsed > 0 ? Math.floor(nodes / (elapsed / 1000)) : 0) + " nps)");
}

function runDivide(depth) {
    var start = Date.now();
    var nodes = divide(depth);
    var elapsed = Date.now() - start;
    sendInfoString("Divide completed in " + elapsed + "ms, " + nodes + " nodes");
}

function printBoard() {
    var output = "\n";
    for (var rank = 7; rank >= 0; rank--) {
        output += (rank + 1) + "  ";
        for (var file = 0; file < 8; file++) {
            var sq = makeSquare(file, rank);
            var piece = g_board[sq];
            var ch = ".";
            if (piece.piece !== PIECE_NONE) {
                ch = g_pieceToChar[piece.piece];
                if (piece.color === COLOR_WHITE) ch = ch.toUpperCase();
            }
            output += ch + " ";
        }
        output += "\n";
    }
    output += "\n   a b c d e f g h\n";
    output += "FEN: " + getFEN() + "\n";
    output += "Side: " + (g_sideToMove === COLOR_WHITE ? "White" : "Black") + "\n";
    output += "Phase: " + g_phaseScore + " (" + (g_gamePhase === GAME_PHASE_OPENING ? "opening" : g_gamePhase === GAME_PHASE_MIDDLEGAME ? "middlegame" : "endgame") + ")\n";
    output += "Hash: " + getPositionHash().toString(16) + "\n";
    output += "Eval: " + evaluate() + "\n";
    sendInfoString(output);
}

function getSearchStats() {
    return {
        nodes: g_searchStats.nodes,
        qnodes: g_searchStats.qnodes,
        tthits: g_searchStats.tthits,
        ttcuts: g_searchStats.ttcuts,
        nullCuts: g_searchStats.nullCuts,
        lmrReductions: g_searchStats.lmrReductions,
        futilityPrunes: g_searchStats.futilityPrunes,
        razorPrunes: g_searchStats.razorPrunes,
        extensions: g_searchStats.extensions,
        checkExtensions: g_searchStats.checkExtensions,
        singularExtensions: g_searchStats.singularExtensions,
        aspirationResearches: g_searchStats.aspirationResearches,
        nps: g_searchStats.nps,
        bestMoveChanges: g_bestMoveChanges,
        pv: g_currentPV ? g_currentPV.map(moveToString) : []
    };
}

function getEngineInfo() {
    return {
        name: ENGINE_NAME,
        version: ENGINE_VERSION,
        author: ENGINE_AUTHOR,
        options: g_engineOptions,
        pieceValues: g_pieceValues,
        phase: g_gamePhase,
        phaseScore: g_phaseScore,
        hashSize: g_ttSize,
        hashEntries: Object.keys(g_transpositionTable).length
    };
}

function setEngineName(name) {
    ENGINE_NAME = name;
}

function setEngineAuthor(author) {
    ENGINE_AUTHOR = author;
}

function setEngineVersion(version) {
    ENGINE_VERSION = version;
}

function clearAllCaches() {
    g_transpositionTable = {};
    g_evalCache = {};
    g_pawnHashTable = {};
    g_historyTable = [{}, {}];
    g_counterMoves = [{}, {}];
}

function resetFullState() {
    resetSearchState();
    initializeBoard();
    initZobrist();
    clearAllCaches();
    g_positionHistory = [];
    g_moveHistory = [];
    g_fullMoveNumber = 1;
    g_halfMoveClock = 0;
    updateGamePhase();
}

function isEndgame() {
    return g_gamePhase === GAME_PHASE_ENDGAME;
}

function isOpening() {
    return g_gamePhase === GAME_PHASE_OPENING;
}

function isMiddlegame() {
    return g_gamePhase === GAME_PHASE_MIDDLEGAME;
}

function getPieceCount(pieceType, color) {
    var count = 0;
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === pieceType && p.color === color) count++;
    }
    return count;
}

function getMaterialBalance() {
    var balance = 0;
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE || p.piece === PIECE_KING) continue;
        var val = getPieceValue(p.piece);
        if (p.color === COLOR_WHITE) balance += val;
        else balance -= val;
    }
    return balance;
}

function validatePosition() {
    var wKing = 0, bKing = 0;
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_KING) {
            if (p.color === COLOR_WHITE) wKing++;
            else bKing++;
        }
    }
    return wKing === 1 && bKing === 1;
}

function positionToString() {
    return getFEN();
}

function getCurrentPly() {
    return g_moveHistory.length;
}

function getSideToMove() {
    return g_sideToMove;
}

function getCastlingRights() {
    return g_castlingRights;
}

function getEnPassantSquare() {
    return g_enPassantSquare;
}

function getHalfMoveClock() {
    return g_halfMoveClock;
}

function getFullMoveNumber() {
    return g_fullMoveNumber;
}

function getMoveHistoryString() {
    var result = [];
    for (var i = 0; i < g_moveHistory.length; i++) {
        result.push(moveToString(g_moveHistory[i].move));
    }
    return result.join(" ");
}

function getLastMove() {
    if (g_moveHistory.length === 0) return null;
    return g_moveHistory[g_moveHistory.length - 1].move;
}

function canCastle(color, side) {
    if (color === COLOR_WHITE) {
        if (side === "kingside") return (g_castlingRights & CASTLE_WK) !== 0;
        return (g_castlingRights & CASTLE_WQ) !== 0;
    } else {
        if (side === "kingside") return (g_castlingRights & CASTLE_BK) !== 0;
        return (g_castlingRights & CASTLE_BQ) !== 0;
    }
}

function isPassedPawn(sq, color) {
    var f = squareFile(sq);
    var r = squareRank(sq);
    var isWhite = color === COLOR_WHITE;

    for (var df = -1; df <= 1; df++) {
        var checkFile = f + df;
        if (checkFile < 0 || checkFile > 7) continue;
        if (isWhite) {
            // FIXED: White pawns move toward higher ranks, so check AHEAD (higher ranks)
            for (var checkRank = r + 1; checkRank < 8; checkRank++) {
                var checkSq = makeSquare(checkFile, checkRank);
                if (g_board[checkSq].piece === PIECE_PAWN && g_board[checkSq].color === COLOR_BLACK) return false;
            }
        } else {
            // FIXED: Black pawns move toward lower ranks, so check AHEAD (lower ranks)
            for (var checkRank = r - 1; checkRank >= 0; checkRank--) {
                var checkSq = makeSquare(checkFile, checkRank);
                if (g_board[checkSq].piece === PIECE_PAWN && g_board[checkSq].color === COLOR_WHITE) return false;
            }
        }
    }
    return g_board[sq].piece === PIECE_PAWN && g_board[sq].color === color;
}

function getKingSquare(color) {
    return findKingSquare(color);
}

function getLegalMovesCount(color) {
    return generateLegalMoves(color).length;
}

function perftTest(expected) {
    var results = {};
    for (var depth in expected) {
        var nodes = perft(parseInt(depth));
        results[depth] = nodes;
    }
    return results;
}

function isCaptureMove(move) {
    return move.captured !== PIECE_NONE;
}

function isCheckMove(move) {
    makeMove(move);
    var check = isInCheck(g_sideToMove);
    undoMove();
    return check;
}

function isPromotionMove(move) {
    return move.promotion !== PIECE_NONE;
}

function isCastlingMove(move) {
    return move.flags & FLAG_CASTLING;
}

function getPieceOnSquare(sq) {
    if (!isValidSquare(sq)) return null;
    return g_board[sq];
}

function setPieceOnSquare(sq, piece, color) {
    if (!isValidSquare(sq)) return;
    g_board[sq] = {piece: piece, color: color};
}

function removePieceFromSquare(sq) {
    if (!isValidSquare(sq)) return;
    g_board[sq] = {piece: PIECE_NONE, color: -1};
}

function swapSideToMove() {
    g_sideToMove = 1 - g_sideToMove;
}

function resetBoard() {
    initializeBoard();
    updateGamePhase();
}

function setupPosition(fen) {
    setFEN(fen);
}

function getBoardCopy() {
    var copy = [];
    for (var i = 0; i < 128; i++) {
        copy[i] = {piece: g_board[i].piece, color: g_board[i].color};
    }
    return copy;
}

function restoreBoard(boardCopy) {
    for (var i = 0; i < 128; i++) {
        g_board[i] = {piece: boardCopy[i].piece, color: boardCopy[i].color};
    }
}

function getSAN(move) {
    return moveToSAN(move);
}

function searchRoot(depth, alpha, beta) {
    return alphaBetaRoot(depth, alpha, beta);
}

function searchAB(ply, depth, alpha, beta, isPV) {
    return alphaBeta(ply, depth, alpha, beta, isPV, true);
}

function qSearch(ply, alpha, beta) {
    return quiescence(ply, alpha, beta, 0);
}

function getStaticEvaluation() {
    return evaluate();
}

function probeHash(hash, depth, alpha, beta) {
    return probeTranspositionTable(hash, depth, alpha, beta);
}

function storeHash(hash, depth, score, flag, move) {
    storeTranspositionTable(hash, depth, score, flag, move);
}

function getTTSize() {
    return Object.keys(g_transpositionTable).length;
}

function clearTT() {
    g_transpositionTable = {};
}

function getHistoryScore(move, side) {
    var key = move.from + "-" + move.to;
    return g_historyTable[side][key] || 0;
}

function getKillerMove(ply, index) {
    if (ply >= MAX_PLY) return null;
    return g_killerMoves[ply][index] || null;
}

function isKillerMove(move, ply) {
    if (ply >= MAX_PLY) return false;
    return (g_killerMoves[ply][0] && movesEqual(move, g_killerMoves[ply][0])) ||
           (g_killerMoves[ply][1] && movesEqual(move, g_killerMoves[ply][1]));
}

function getCounterMove(lastMove, side) {
    if (!lastMove) return null;
    var key = lastMove.from + "-" + lastMove.to;
    return g_counterMoves[side][key] || null;
}

function hasOpeningBook() {
    return g_useOpeningBook && Object.keys(g_openingBook).length > 0;
}

function setOpeningBook(book) {
    g_openingBook = book || {};
}

function getBookMove() {
    if (!g_useOpeningBook) return null;
    var hash = getPositionHash();
    var entries = g_openingBook[hash];
    if (!entries || entries.length === 0) return null;
    var totalWeight = 0;
    for (var i = 0; i < entries.length; i++) totalWeight += entries[i].weight || 1;
    var random = Math.random() * totalWeight;
    var cumulative = 0;
    for (var i = 0; i < entries.length; i++) {
        cumulative += entries[i].weight || 1;
        if (random <= cumulative) return stringToMove(entries[i].move);
    }
    return stringToMove(entries[0].move);
}

function addBookEntry(hash, move, weight) {
    if (!g_openingBook[hash]) g_openingBook[hash] = [];
    g_openingBook[hash].push({move: move, weight: weight || 1});
}

function clearOpeningBook() {
    g_openingBook = {};
}

function enableOpeningBook(enable) {
    g_useOpeningBook = enable;
}

function isInOpening() {
    return g_moveHistory.length < 10;
}

function isEndgameMaterial() {
    return g_phaseScore <= 8;
}

function getGamePhaseScore() {
    return g_phaseScore;
}

function isOppositeBishops() {
    var wBishopSq = -1, bBishopSq = -1;
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_BISHOP) {
            if (p.color === COLOR_WHITE && wBishopSq === -1) wBishopSq = i;
            if (p.color === COLOR_BLACK && bBishopSq === -1) bBishopSq = i;
        }
    }
    if (wBishopSq === -1 || bBishopSq === -1) return false;
    return ((squareFile(wBishopSq) + squareRank(wBishopSq)) % 2) !==
           ((squareFile(bBishopSq) + squareRank(bBishopSq)) % 2);
}

function isRookEndgame() {
    var wRooks = 0, bRooks = 0, wMinors = 0, bMinors = 0, wQueens = 0, bQueens = 0;
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE || p.piece === PIECE_PAWN || p.piece === PIECE_KING) continue;
        if (p.color === COLOR_WHITE) {
            if (p.piece === PIECE_ROOK) wRooks++;
            else if (p.piece === PIECE_QUEEN) wQueens++;
            else wMinors++;
        } else {
            if (p.piece === PIECE_ROOK) bRooks++;
            else if (p.piece === PIECE_QUEEN) bQueens++;
            else bMinors++;
        }
    }
    return wQueens === 0 && bQueens === 0 && wMinors === 0 && bMinors === 0 && (wRooks > 0 || bRooks > 0);
}

function isPawnEndgame() {
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE || p.piece === PIECE_PAWN || p.piece === PIECE_KING) continue;
        return false;
    }
    return true;
}

function getPawnMajority(side) {
    var majority = 0;
    for (var f = 0; f < 8; f++) {
        var count = 0;
        for (var r = 0; r < 8; r++) {
            var sq = makeSquare(f, r);
            if (g_board[sq].piece === PIECE_PAWN && g_board[sq].color === side) count++;
        }
        if (count > 0) majority++;
    }
    return majority;
}

function evaluateEndgameSpecialCases() {
    var score = 0;

    if (isPawnEndgame()) {
        var wKing = findKingSquare(COLOR_WHITE);
        var bKing = findKingSquare(COLOR_BLACK);
        var wPawns = getPieceCount(PIECE_PAWN, COLOR_WHITE);
        var bPawns = getPieceCount(PIECE_PAWN, COLOR_BLACK);

        if (wPawns === 0 && bPawns === 0) return g_engineOptions.drawScore;

        for (var i = 0; i < 128; i++) {
            if (!isValidSquare(i)) continue;
            var p = g_board[i];
            if (p.piece !== PIECE_PAWN) continue;

            if (isPassedPawn(i, p.color)) {
                var promoDist = p.color === COLOR_WHITE ? 7 - squareRank(i) : squareRank(i);
                var kingDist = squareDistance(i, p.color === COLOR_WHITE ? bKing : wKing);
                var bonus = PASSED_PAWN_BONUS_EG[promoDist];
                if (kingDist <= promoDist + 2) bonus = Math.floor(bonus * 0.7);

                if (p.color === COLOR_WHITE) score += bonus;
                else score -= bonus;
            }
        }
    }

    if (isRookEndgame()) {
        var wKing = findKingSquare(COLOR_WHITE);
        var bKing = findKingSquare(COLOR_BLACK);
        score += (squareDistance(wKing, bKing) - 4) * 5;
    }

    if (isOppositeBishops()) {
        var wPawns = getPieceCount(PIECE_PAWN, COLOR_WHITE);
        var bPawns = getPieceCount(PIECE_PAWN, COLOR_BLACK);
        if (wPawns <= 1 && bPawns <= 1) {
            score = score * 0.3;
        }
    }

    return score;
}

function evaluateComplexMiddleGame() {
    var score = 0;
    var wAttacked = 0, bAttacked = 0;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE || p.piece === PIECE_PAWN || p.piece === PIECE_KING) continue;

        if (p.color === COLOR_WHITE) {
            if (isInEnemyTerritory(i, COLOR_WHITE)) wAttacked += getPieceValue(p.piece) / 200;
        } else {
            if (isInEnemyTerritory(i, COLOR_BLACK)) bAttacked += getPieceValue(p.piece) / 200;
        }
    }

    score += wAttacked * g_engineOptions.threatWeight;
    score -= bAttacked * g_engineOptions.threatWeight;

    var centerControl = 0;
    for (var i = 0; i < 4; i++) {
        var wAtt = isSquareAttacked(CENTER_SQUARES[i], COLOR_WHITE);
        var bAtt = isSquareAttacked(CENTER_SQUARES[i], COLOR_BLACK);
        if (wAtt && !bAtt) centerControl += 5;
        if (bAtt && !wAtt) centerControl -= 5;

        var p = g_board[CENTER_SQUARES[i]];
        if (p.piece === PIECE_PAWN) {
            if (p.color === COLOR_WHITE) centerControl += 10;
            else centerControl -= 10;
        }
    }
    score += centerControl * g_engineOptions.spaceWeight / 2;

    return score;
}

function isInEnemyTerritory(sq, color) {
    var r = squareRank(sq);
    if (color === COLOR_WHITE) return r >= 5;
    return r <= 2;
}

function evaluateTacticalMotifs() {
    var score = 0;

    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE || p.piece === PIECE_PAWN || p.piece === PIECE_KING) continue;

        var defenders = getAttackingPieces(i, p.color);
        var attackers = getAttackingPieces(i, 1 - p.color);

        if (attackers.length > defenders.length && defenders.length > 0) {
            var penalty = getPieceValue(p.piece) * 0.1 * (attackers.length - defenders.length);
            if (p.color === COLOR_WHITE) score -= penalty;
            else score += penalty;
        }

        if (p.piece === PIECE_KNIGHT || p.piece === PIECE_BISHOP) {
            for (var j = 0; j < 8; j++) {
                var forkSq = i + KNIGHT_DELTAS[j];
                if (!isValidSquare(forkSq)) continue;
                var target = g_board[forkSq];
                if (target.piece !== PIECE_NONE && target.color !== p.color &&
                    (target.piece === PIECE_QUEEN || target.piece === PIECE_ROOK)) {
                    if (p.color === COLOR_WHITE) score += 15;
                    else score -= 15;
                }
            }
        }
    }

    return score * g_engineOptions.threatWeight / 5;
}

function evaluatePieceCoordination() {
    var score = 0;

    for (var color = 0; color < 2; color++) {
        var sign = color === COLOR_WHITE ? 1 : -1;
        var minors = [];
        var rooks = [];
        var queens = [];

        for (var i = 0; i < 128; i++) {
            if (!isValidSquare(i)) continue;
            var p = g_board[i];
            if (p.piece === PIECE_NONE || p.color !== color) continue;
            if (p.piece === PIECE_KNIGHT || p.piece === PIECE_BISHOP) minors.push(i);
            if (p.piece === PIECE_ROOK) rooks.push(i);
            if (p.piece === PIECE_QUEEN) queens.push(i);
        }

        for (var i = 0; i < minors.length; i++) {
            for (var j = i + 1; j < minors.length; j++) {
                if (squareDistance(minors[i], minors[j]) <= 2) {
                    score += 3 * sign;
                }
            }
        }

        for (var i = 0; i < rooks.length; i++) {
            for (var j = i + 1; j < rooks.length; j++) {
                if (squareFile(rooks[i]) === squareFile(rooks[j]) ||
                    squareRank(rooks[i]) === squareRank(rooks[j])) {
                    score += g_engineOptions.rookCoordinationBonus * sign;
                }
            }
        }

        for (var i = 0; i < queens.length; i++) {
            for (var j = 0; j < minors.length; j++) {
                if (squareDistance(queens[i], minors[j]) <= 2) {
                    score += 5 * sign;
                }
            }
        }
    }

    return score;
}

function evaluateWeaknesses() {
    var score = 0;

    for (var color = 0; color < 2; color++) {
        var sign = color === COLOR_WHITE ? 1 : -1;
        var kingSq = findKingSquare(color);
        var kf = squareFile(kingSq);
        var kr = squareRank(kingSq);

        var weakPawns = 0;
        for (var f = Math.max(0, kf - 1); f <= Math.min(7, kf + 1); f++) {
            var hasPawn = false;
            for (var r = 0; r < 8; r++) {
                var sq = makeSquare(f, r);
                if (g_board[sq].piece === PIECE_PAWN && g_board[sq].color === color) {
                    hasPawn = true;
                    break;
                }
            }
            if (!hasPawn) weakPawns++;
        }
        score -= weakPawns * 10 * sign;

        var undefendedPieces = 0;
        for (var i = 0; i < 128; i++) {
            if (!isValidSquare(i)) continue;
            var p = g_board[i];
            if (p.piece === PIECE_NONE || p.piece === PIECE_PAWN || p.piece === PIECE_KING || p.color !== color) continue;

            var defended = false;
            for (var j = 0; j < 128; j++) {
                if (!isValidSquare(j) || j === i) continue;
                var defender = g_board[j];
                if (defender.piece === PIECE_NONE || defender.color !== color) continue;
                if (pieceAttacksSquare(j, defender, i)) {
                    defended = true;
                    break;
                }
            }
            if (!defended) undefendedPieces++;
        }
        score -= undefendedPieces * 8 * sign;
    }

    return score;
}

function evaluateLongTermAdvantages() {
    var score = 0;

    var wCenterPawns = 0, bCenterPawns = 0;
    for (var i = 0; i < CENTER_SQUARES.length; i++) {
        var p = g_board[CENTER_SQUARES[i]];
        if (p.piece === PIECE_PAWN) {
            if (p.color === COLOR_WHITE) wCenterPawns++;
            else bCenterPawns++;
        }
    }
    score += (wCenterPawns - bCenterPawns) * g_engineOptions.centralPawnBonus;

    var wSpace = 0, bSpace = 0;
    for (var r = 3; r <= 4; r++) {
        for (var f = 2; f <= 5; f++) {
            var sq = makeSquare(f, r);
            if (g_board[sq].piece !== PIECE_NONE) {
                if (g_board[sq].color === COLOR_WHITE) wSpace++;
                else bSpace++;
            }
        }
    }
    score += (wSpace - bSpace) * g_engineOptions.spaceWeight;

    var wMobility = countMobility(COLOR_WHITE);
    var bMobility = countMobility(COLOR_BLACK);
    score += (wMobility - bMobility) * g_engineOptions.mobilityWeight / 10;

    return score;
}

function countMobility(color) {
    var mobility = 0;
    for (var i = 0; i < 128; i++) {
        if (!isValidSquare(i)) continue;
        var p = g_board[i];
        if (p.piece === PIECE_NONE || p.color !== color) continue;

        if (p.piece === PIECE_KNIGHT) {
            for (var j = 0; j < 8; j++) {
                var to = i + KNIGHT_DELTAS[j];
                if (isValidSquare(to) && (g_board[to].piece === PIECE_NONE || g_board[to].color !== color)) mobility++;
            }
        } else if (p.piece === PIECE_BISHOP) {
            for (var j = 0; j < 4; j++) {
                var to = i + BISHOP_DELTAS[j];
                while (isValidSquare(to)) {
                    if (g_board[to].piece === PIECE_NONE || g_board[to].color !== color) mobility++;
                    if (g_board[to].piece !== PIECE_NONE) break;
                    to += BISHOP_DELTAS[j];
                }
            }
        } else if (p.piece === PIECE_ROOK) {
            for (var j = 0; j < 4; j++) {
                var to = i + ROOK_DELTAS[j];
                while (isValidSquare(to)) {
                    if (g_board[to].piece === PIECE_NONE || g_board[to].color !== color) mobility++;
                    if (g_board[to].piece !== PIECE_NONE) break;
                    to += ROOK_DELTAS[j];
                }
            }
        } else if (p.piece === PIECE_QUEEN) {
            for (var j = 0; j < 8; j++) {
                var to = i + QUEEN_DELTAS[j];
                while (isValidSquare(to)) {
                    if (g_board[to].piece === PIECE_NONE || g_board[to].color !== color) mobility++;
                    if (g_board[to].piece !== PIECE_NONE) break;
                    to += QUEEN_DELTAS[j];
                }
            }
        }
    }
    return mobility;
}

function enhancedEvaluation() {
    var score = evaluateFull();

    if (g_gamePhase === GAME_PHASE_ENDGAME || g_phaseScore <= 12) {
        score += evaluateEndgameSpecialCases();
    }

    if (g_gamePhase === GAME_PHASE_MIDDLEGAME || g_gamePhase === GAME_PHASE_OPENING) {
        score += evaluateComplexMiddleGame();
        score += evaluateTacticalMotifs();
        score += evaluatePieceCoordination();
    }

    score += evaluateWeaknesses();
    score += evaluateLongTermAdvantages();

    return score;
}

function runBenchmark() {
    var positions = [
        INITIAL_FEN,
        "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
        "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 1",
        "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1",
        "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 1",
        "rn1qkb1r/pp2pppp/2p2n2/5b2/P1BP4/2N2N2/1PP2PPP/R1BQK2R b KQkq - 0 1"
    ];

    var totalNodes = 0;
    var totalTime = 0;

    for (var p = 0; p < positions.length; p++) {
        setFEN(positions[p]);
        resetSearchState();
        var start = Date.now();
        var bm = iterativeDeepening(8, 5000, false);
        var elapsed = Date.now() - start;
        totalNodes += g_searchNodes;
        totalTime += elapsed;
        sendInfoString("Bench " + (p + 1) + "/" + positions.length + ": " + elapsed + "ms, " + g_searchNodes + " nodes, bm=" + moveToString(bm));
    }

    var avgNps = totalTime > 0 ? Math.floor(totalNodes / (totalTime / 1000)) : 0;
    sendInfoString("Benchmark complete: " + totalNodes + " nodes in " + totalTime + "ms (" + avgNps + " nps)");
    return {nodes: totalNodes, time: totalTime, nps: avgNps};
}

function searchFixedDepth(depth) {
    return iterativeDeepening(depth, null, false);
}

function searchFixedTime(ms) {
    return iterativeDeepening(128, ms, false);
}

function searchInfinite() {
    return iterativeDeepening(128, null, true);
}

function stopSearch() {
    g_stopSearch = true;
    g_isPondering = false;
}

function isSearching() {
    return g_isSearching;
}

function getCurrentBestMove() {
    return g_lastBestMove ? cloneMove(g_lastBestMove) : null;
}

function getCurrentPVString() {
    if (!g_currentPV || g_currentPV.length === 0) return "";
    var result = [];
    for (var i = 0; i < g_currentPV.length; i++) {
        result.push(moveToString(g_currentPV[i]));
    }
    return result.join(" ");
}

function getNodesSearched() {
    return g_searchNodes;
}

function resetNodes() {
    g_searchNodes = 0;
}

function setContempt(contempt) {
    g_engineOptions.contempt = contempt;
}

function setDrawScore(score) {
    g_engineOptions.drawScore = score;
}

function getPhase() {
    return g_gamePhase;
}

function getPhaseName() {
    switch (g_gamePhase) {
        case GAME_PHASE_OPENING: return "opening";
        case GAME_PHASE_MIDDLEGAME: return "middlegame";
        case GAME_PHASE_ENDGAME: return "endgame";
        default: return "unknown";
    }
}

function initializeEngine() {
    initializeBoard();
    initZobrist();
    buildLMRTable();
    buildFutilityMargins();
    buildRazorMargins();
    updateGamePhase();
    resetSearchState();
    sendInfoString(ENGINE_NAME + " v" + ENGINE_VERSION + " by " + ENGINE_AUTHOR + " initialized");
}

function selfTest() {
    var passed = 0;
    var failed = 0;

    setFEN(INITIAL_FEN);
    var moves = generateLegalMoves(COLOR_WHITE);
    if (moves.length === 20) passed++; else { failed++; sendInfoString("FAIL: Initial position moves=" + moves.length + ", expected 20"); }

    var p5 = perft(5);
    if (p5 === 4865609) passed++; else { failed++; sendInfoString("FAIL: Perft(5)=" + p5 + ", expected 4865609"); }

    setFEN("r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1");
    var castleMoves = generateLegalMoves(COLOR_WHITE);
    var hasKingside = false, hasQueenside = false;
    for (var i = 0; i < castleMoves.length; i++) {
        if (castleMoves[i].flags & FLAG_CASTLING) {
            if (castleMoves[i].to > castleMoves[i].from) hasKingside = true;
            else hasQueenside = true;
        }
    }
    if (hasKingside && hasQueenside) passed++; else { failed++; sendInfoString("FAIL: Castling moves"); }

    setFEN(INITIAL_FEN);
    var epFen = "rnbqkbnr/pppppppp/8/8/4Pp2/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
    setFEN(epFen);
    var epMoves = generateLegalMoves(COLOR_BLACK);
    var hasEP = false;
    for (var i = 0; i < epMoves.length; i++) {
        if (epMoves[i].flags & FLAG_ENPASSANT) hasEP = true;
    }
    if (hasEP) passed++; else { failed++; sendInfoString("FAIL: En passant detection"); }

    setFEN("8/8/8/8/8/8/PPPPPPPP/8 w - - 0 1");
    var promoMoves = generateLegalMoves(COLOR_WHITE);
    var promoCount = 0;
    for (var i = 0; i < promoMoves.length; i++) {
        if (promoMoves[i].flags & FLAG_PROMOTION) promoCount++;
    }
    if (promoCount === 8) passed++; else { failed++; sendInfoString("FAIL: Promotion moves=" + promoCount + ", expected 8"); }

    setFEN(INITIAL_FEN);
    var evalScore = evaluate();
    if (Math.abs(evalScore) < 50) passed++; else { failed++; sendInfoString("FAIL: Initial eval=" + evalScore); }

    setFEN("rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 0 1");
    var checkmateMoves = generateLegalMoves(COLOR_WHITE);
    if (checkmateMoves.length === 0 && isInCheck(COLOR_WHITE)) passed++; else { failed++; sendInfoString("FAIL: Checkmate detection"); }

    setFEN(INITIAL_FEN);
    var fen = getFEN();
    if (fen.split(" ")[0] === INITIAL_FEN.split(" ")[0]) passed++; else { failed++; sendInfoString("FAIL: FEN export"); }

    sendInfoString("Self-test: " + passed + " passed, " + failed + " failed");
    return failed === 0;
}

function runSelfTest() {
    return selfTest();
}

function verifyMoveLegality(moveStr) {
    var move = stringToMove(moveStr);
    if (!move) return false;
    var legalMoves = generateLegalMoves(g_sideToMove);
    for (var i = 0; i < legalMoves.length; i++) {
        if (movesEqual(move, legalMoves[i])) return true;
    }
    return false;
}

function getAllLegalMoves() {
    return generateLegalMoves(g_sideToMove);
}

function getAllLegalMovesString() {
    var moves = generateLegalMoves(g_sideToMove);
    var result = [];
    for (var i = 0; i < moves.length; i++) {
        result.push(moveToString(moves[i]));
    }
    return result;
}

function getAllLegalSAN() {
    var moves = generateLegalMoves(g_sideToMove);
    var result = [];
    for (var i = 0; i < moves.length; i++) {
        result.push(moveToSAN(moves[i]));
    }
    return result;
}

function playMove(moveStr) {
    var move = stringToMove(moveStr);
    if (!move) return false;
    makeMove(move);
    return true;
}

function undoLastMove() {
    if (g_moveHistory.length === 0) return false;
    undoMove();
    return true;
}

function resetToStart() {
    setFEN(INITIAL_FEN);
    resetSearchState();
}

function loadEPD(epd) {
    var fenPart = epd.split(/\s+c0\s+|\s+bm\s+|\s+am\s+/)[0];
    setFEN(fenPart + " 0 1");
}

function getCentipawnScore() {
    var ev = evaluate();
    return Math.round(ev);
}

function getMateInScore() {
    var ev = evaluate();
    if (Math.abs(ev) > VALUE_MATE - MAX_PLY) {
        return ev > 0 ? Math.ceil((VALUE_MATE - ev) / 2) : -Math.ceil((VALUE_MATE + ev) / 2);
    }
    return null;
}

function isGameOver() {
    var moves = generateLegalMoves(g_sideToMove);
    if (moves.length === 0) return true;
    if (g_halfMoveClock >= 100) return true;
    if (isThreefoldRepetition()) return true;
    if (isInsufficientMaterial()) return true;
    return false;
}

function getGameResult() {
    var moves = generateLegalMoves(g_sideToMove);
    if (moves.length === 0) {
        if (isInCheck(g_sideToMove)) {
            return g_sideToMove === COLOR_WHITE ? "0-1" : "1-0";
        }
        return "1/2-1/2";
    }
    if (g_halfMoveClock >= 100) return "1/2-1/2";
    if (isThreefoldRepetition()) return "1/2-1/2";
    if (isInsufficientMaterial()) return "1/2-1/2";
    return "*";
}

function getGameState() {
    return {
        fen: getFEN(),
        sideToMove: g_sideToMove === COLOR_WHITE ? "w" : "b",
        moveNumber: g_fullMoveNumber,
        halfMoveClock: g_halfMoveClock,
        isCheck: isInCheck(g_sideToMove),
        isCheckmate: isCheckmate(g_sideToMove),
        isStalemate: isStalemate(g_sideToMove),
        isDraw: isDraw(),
        result: getGameResult(),
        legalMoves: getAllLegalMovesString(),
        eval: getCentipawnScore(),
        phase: getPhaseName(),
        phaseScore: g_phaseScore
    };
}

function copyMakeUnmake() {
    var copy = getBoardCopy();
    var moves = generateLegalMoves(g_sideToMove);
    if (moves.length === 0) return true;
    var originalFEN = getFEN();
    makeMove(moves[0]);
    undoMove();
    var restoredFEN = getFEN();
    return originalFEN === restoredFEN;
}

function runIntegrityCheck() {
    var checks = 0;
    var passed = 0;

    setFEN(INITIAL_FEN);
    checks++; if (copyMakeUnmake()) passed++;

    setFEN("r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1");
    checks++; if (copyMakeUnmake()) passed++;

    setFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
    var epMoves = generateLegalMoves(COLOR_BLACK);
    for (var i = 0; i < epMoves.length; i++) {
        if (epMoves[i].flags & FLAG_ENPASSANT) {
            setFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
            checks++;
            var origFEN = getFEN();
            makeMove(epMoves[i]);
            undoMove();
            if (getFEN() === origFEN) passed++;
            break;
        }
    }

    setFEN(INITIAL_FEN);
    var promoFEN = "8/PPPPPPPP/8/8/8/8/8/8 w - - 0 1";
    setFEN(promoFEN);
    checks++; if (copyMakeUnmake()) passed++;

    sendInfoString("Integrity: " + passed + "/" + checks + " checks passed");
    return passed === checks;
}

initializeEngine();
