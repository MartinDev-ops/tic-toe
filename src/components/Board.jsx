import Square from './Square';

// Board is a "dumb" component: it only renders squares and reports
// clicks upward. All game rules live in gameLogic.js / gameReducer.js.
// `locked` disables every square (game over, or waiting for the computer).
export default function Board({ squares, winningLine, locked, onSquareClick }) {
  return (
    <div className="board">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={Boolean(winningLine && winningLine.includes(index))}
          disabled={Boolean(value) || locked}
        />
      ))}
    </div>
  );
}
