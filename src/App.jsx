import { useReducer } from 'react';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import MoveHistory from './components/MoveHistory';
import { gameReducer, initialGameState } from './gameReducer';
import { calculateWinner, isBoardFull, playerForMove } from './gameLogic';
import './App.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { history, currentMove, scores } = state;

  const currentSquares = history[currentMove];
  const result = calculateWinner(currentSquares);
  const draw = !result && isBoardFull(currentSquares);
  const gameIsOver = Boolean(result) || draw;
  const nextPlayer = playerForMove(currentMove);

  let status;
  if (result) {
    status = `Winner: ${result.winner}`;
  } else if (draw) {
    status = 'Draw!';
  } else {
    status = `Next Player: ${nextPlayer}`;
  }

  function handleSquareClick(index) {
    dispatch({ type: 'MAKE_MOVE', index });
  }

  function handleJumpTo(move) {
    dispatch({ type: 'JUMP_TO', move });
  }

  function handleRestartBoard() {
    dispatch({ type: 'RESET_BOARD' });
  }

  function handleResetScores() {
    dispatch({ type: 'RESET_SCORES' });
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Tic Tac Toe</h1>
      </header>

      <main className="app__layout">
        <section className="panel game-panel" aria-label="Game board">
          <p className={`status${gameIsOver ? ' status--over' : ''}`} role="status">
            {status}
          </p>

          <Board
            squares={currentSquares}
            winningLine={result ? result.line : null}
            gameIsOver={gameIsOver}
            onSquareClick={handleSquareClick}
          />

          <button type="button" className="primary-button" onClick={handleRestartBoard}>
            Restart game
          </button>
        </section>

        <aside className="app__sidebar">
          <Scoreboard scores={scores} onResetScores={handleResetScores} />
          <MoveHistory
            history={history}
            currentMove={currentMove}
            onJumpTo={handleJumpTo}
          />
        </aside>
      </main>
    </div>
  );
}
