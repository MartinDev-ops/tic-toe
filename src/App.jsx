import { useEffect, useReducer } from 'react';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import MoveHistory from './components/MoveHistory';
import GameModeSettings from './components/GameModeSettings';
import { ACTIONS, gameReducer, initialGameState } from './gameReducer';
import { calculateWinner, isBoardFull, playerForMove } from './gameLogic';
import { BOT_PLAYER, chooseBotMove } from './botLogic';

const BOT_DELAY_MS = 500;
import './App.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { history, currentMove, scores, mode, difficulty } = state;

  const currentSquares = history[currentMove];
  const result = calculateWinner(currentSquares);
  const draw = !result && isBoardFull(currentSquares);
  const gameIsOver = Boolean(result) || draw;
  const nextPlayer = playerForMove(currentMove);

  // The bot only moves on the latest board, so stepping back through the
  // move history lets you look at old positions without the bot playing.
  const isLatestMove = currentMove === history.length - 1;
  const isBotTurn = mode === 'bot' && nextPlayer === BOT_PLAYER && !gameIsOver;

  useEffect(() => {
    if (!isBotTurn || !isLatestMove) return undefined;
    const timer = setTimeout(() => {
      const index = chooseBotMove(currentSquares, difficulty);
      dispatch({ type: ACTIONS.MAKE_MOVE, index, byBot: true });
    }, BOT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isBotTurn, isLatestMove, currentSquares, difficulty]);

  let status;
  if (result) {
    status = `Winner: ${result.winner}`;
  } else if (draw) {
    status = 'Draw!';
  } else {
    status = `Next Player: ${nextPlayer}`;
  }

  function handleSquareClick(index) {
    dispatch({ type: ACTIONS.MAKE_MOVE, index });
  }

  function handleJumpTo(move) {
    dispatch({ type: ACTIONS.JUMP_TO, move });
  }

  function handleRestartBoard() {
    dispatch({ type: ACTIONS.RESET_BOARD });
  }

  function handleResetScores() {
    dispatch({ type: ACTIONS.RESET_SCORES });
  }

  function handleModeChange(nextMode) {
    dispatch({ type: ACTIONS.SET_MODE, mode: nextMode });
  }

  function handleDifficultyChange(nextDifficulty) {
    dispatch({ type: ACTIONS.SET_DIFFICULTY, difficulty: nextDifficulty });
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Tic Tac Toe</h1>
      </header>

      <main className="app__layout">
        <section className="panel game-panel" aria-label="Game board">
          <GameModeSettings
            mode={mode}
            difficulty={difficulty}
            onModeChange={handleModeChange}
            onDifficultyChange={handleDifficultyChange}
          />

          <p className={`status${gameIsOver ? ' status--over' : ''}`} role="status">
            {status}
          </p>
          {isBotTurn && isLatestMove && <p className="status-hint">Computer is thinking…</p>}

          <Board
            squares={currentSquares}
            winningLine={result ? result.line : null}
            locked={gameIsOver || isBotTurn}
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
