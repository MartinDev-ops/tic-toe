// Pure helper functions for evaluating the board.
// Kept separate from the reducer and components so the win/draw rules
// live in exactly one place (no duplicated logic).

export const EMPTY_BOARD = Array(9).fill(null);

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Returns { winner: 'X' | 'O', line: [a, b, c] } or null if no winner yet.
export function calculateWinner(squares) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export function isBoardFull(squares) {
  return squares.every((value) => value !== null);
}

export function playerForMove(moveIndex) {
  return moveIndex % 2 === 0 ? 'X' : 'O';
}

export function otherPlayer(player) {
  return player === 'X' ? 'O' : 'X';
}

// Single source of truth for "is the game over, and how?".
// `timedOut` is the player who ran out of time (turn timer), or null.
// Returns { winner, line, draw, over }.
export function getOutcome(squares, timedOut = null) {
  const result = calculateWinner(squares);
  if (result) return { winner: result.winner, line: result.line, draw: false, over: true };
  if (timedOut) return { winner: otherPlayer(timedOut), line: null, draw: false, over: true };
  if (isBoardFull(squares)) return { winner: null, line: null, draw: true, over: true };
  return { winner: null, line: null, draw: false, over: false };
}

// The label shown for a player: their typed name, or "Computer" for the bot.
// Falls back to the plain symbol so the default status reads "Next Player: X".
export function playerLabel(player, names, mode) {
  if (mode === 'bot' && player === 'O') return 'Computer (O)';
  const name = names[player].trim();
  return name ? `${name} (${player})` : player;
}

// Describes the move that turned `prev` into `next`, e.g. "X at row 2, col 3".
// `labels` optionally maps 'X' / 'O' to display names.
export function describeMove(prev, next, labels = { X: 'X', O: 'O' }) {
  const index = next.findIndex((value, i) => value !== prev[i]);
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return `${labels[next[index]]} at row ${row}, col ${col}`;
}
