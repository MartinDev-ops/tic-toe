import { calculateWinner, isBoardFull } from './gameLogic';

// The computer always plays O; the human plays X and moves first.
export const BOT_PLAYER = 'O';
const HUMAN_PLAYER = 'X';

function emptySquares(squares) {
  return squares
    .map((value, index) => (value === null ? index : null))
    .filter((index) => index !== null);
}

// Easy mode: any empty square at random.
function randomMove(squares) {
  const options = emptySquares(squares);
  return options[Math.floor(Math.random() * options.length)];
}

// Scores a board from the bot's point of view: positive = bot wins,
// negative = human wins, 0 = draw. Quicker wins score higher.
function minimax(squares, isBotTurn, depth) {
  const result = calculateWinner(squares);
  if (result) return result.winner === BOT_PLAYER ? 10 - depth : depth - 10;
  if (isBoardFull(squares)) return 0;

  const scores = emptySquares(squares).map((index) => {
    const next = squares.slice();
    next[index] = isBotTurn ? BOT_PLAYER : HUMAN_PLAYER;
    return minimax(next, !isBotTurn, depth + 1);
  });
  return isBotTurn ? Math.max(...scores) : Math.min(...scores);
}

// Hard mode: the move with the best minimax score (never loses).
function bestMove(squares) {
  let best = null;
  let bestScore = -Infinity;
  for (const index of emptySquares(squares)) {
    const next = squares.slice();
    next[index] = BOT_PLAYER;
    const score = minimax(next, false, 1);
    if (score > bestScore) {
      bestScore = score;
      best = index;
    }
  }
  return best;
}

export function chooseBotMove(squares, difficulty) {
  return difficulty === 'hard' ? bestMove(squares) : randomMove(squares);
}
