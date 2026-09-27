import Square from './Square';

// Board is a "dumb" component: it only renders squares and reports
// clicks upward. All game rules live in gameLogic.js / gameReducer.js.
export default function Board({ squares, winningLine, gameIsOver, onSquareClick }) {
  return (
    <div className="board">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={Boolean(winningLine && winningLine.includes(index))}
          disabled={Boolean(value) || gameIsOver}
        />
      ))}
    </div>
  );
}
