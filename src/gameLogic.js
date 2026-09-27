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

// Describes the move that turned `prev` into `next`, e.g. "X at row 2, col 3".
export function describeMove(prev, next) {
  const index = next.findIndex((value, i) => value !== prev[i]);
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return `${next[index]} at row ${row}, col ${col}`;
}
