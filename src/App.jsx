import { useCallback, useEffect, useReducer } from 'react';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import MoveHistory from './components/MoveHistory';
import GameSettings from './components/GameSettings';
import PlayerNames from './components/PlayerNames';
import TurnTimer from './components/TurnTimer';
import { ACTIONS, gameReducer, initialGameState } from './gameReducer';
import { getOutcome, playerForMove, playerLabel } from './gameLogic';
import { BOT_PLAYER, chooseBotMove } from './botLogic';
import { useTurnTimer } from './hooks/useTurnTimer';
import './App.css';

const BOT_DELAY_MS = 500;
const TURN_SECONDS = 10;

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { history, currentMove, scores, names, mode, difficulty, timerEnabled, timedOut } = state;

  const currentSquares = history[currentMove];
  const outcome = getOutcome(currentSquares, timedOut);
  const nextPlayer = playerForMove(currentMove);
  const label = (player) => playerLabel(player, names, mode);
  const panelLabels = {
    X: label('X') === 'X' ? 'Player X' : label('X'),
    O: label('O') === 'O' ? 'Player O' : label('O'),
  };

  // The bot and the timer only run on the latest board, so stepping back
  // through the move history lets you look at old positions safely.
  const isLatestMove = currentMove === history.length - 1;
  const isBotTurn = mode === 'bot' && nextPlayer === BOT_PLAYER && !outcome.over;

  useEffect(() => {
    if (!isBotTurn || !isLatestMove) return undefined;
    const timer = setTimeout(() => {
      const index = chooseBotMove(currentSquares, difficulty);
      dispatch({ type: ACTIONS.MAKE_MOVE, index, byBot: true });
    }, BOT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isBotTurn, isLatestMove, currentSquares, difficulty]);

  const handleTimeUp = useCallback(() => dispatch({ type: ACTIONS.TIME_UP }), []);
  const timerActive = timerEnabled && !outcome.over && isLatestMove && !isBotTurn;
  const secondsLeft = useTurnTimer({
    seconds: TURN_SECONDS,
    active: timerActive,
    turnKey: `${history.length}:${currentMove}`,
    onExpire: handleTimeUp,
  });

  let status;
  if (outcome.winner) {
    status = `Winner: ${label(outcome.winner)}`;
  } else if (outcome.draw) {
    status = 'Draw!';
  } else {
    status = `Next Player: ${label(nextPlayer)}`;
  }

  let hint = null;
  if (timedOut && outcome.over) {
    hint = `${label(timedOut)} ran out of time`;
  } else if (isBotTurn && isLatestMove) {
    hint = 'Computer is thinking…';
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Tic Tac Toe</h1>
      </header>

      <main className="app__layout">
        <section className="panel game-panel" aria-label="Game board">
          <GameSettings
            mode={mode}
            difficulty={difficulty}
            timerEnabled={timerEnabled}
            onModeChange={(nextMode) => dispatch({ type: ACTIONS.SET_MODE, mode: nextMode })}
            onDifficultyChange={(level) => dispatch({ type: ACTIONS.SET_DIFFICULTY, difficulty: level })}
            onTimerChange={(enabled) => dispatch({ type: ACTIONS.SET_TIMER, enabled })}
          />

          <p className={`status${outcome.over ? ' status--over' : ''}`} role="status">
            {status}
          </p>
          {hint && <p className="status-hint">{hint}</p>}

          {timerEnabled && !outcome.over && (
            <TurnTimer
              secondsLeft={secondsLeft}
              totalSeconds={TURN_SECONDS}
              playerLabel={label(nextPlayer)}
              paused={!timerActive}
            />
          )}

          <Board
            squares={currentSquares}
            winningLine={outcome.line}
            locked={outcome.over || isBotTurn}
            onSquareClick={(index) => dispatch({ type: ACTIONS.MAKE_MOVE, index })}
          />

          <div className="game-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => dispatch({ type: ACTIONS.UNDO })}
              disabled={currentMove === 0}
            >
              Undo move
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => dispatch({ type: ACTIONS.RESET_BOARD })}
            >
              Restart game
            </button>
          </div>
        </section>

        <aside className="app__sidebar">
          <PlayerNames
            names={names}
            mode={mode}
            onNameChange={(player, name) => dispatch({ type: ACTIONS.SET_PLAYER_NAME, player, name })}
          />
          <Scoreboard
            scores={scores}
            labels={panelLabels}
            onResetScores={() => dispatch({ type: ACTIONS.RESET_SCORES })}
          />
          <MoveHistory
            history={history}
            currentMove={currentMove}
            labels={panelLabels}
            onJumpTo={(move) => dispatch({ type: ACTIONS.JUMP_TO, move })}
          />
        </aside>
      </main>
    </div>
  );
}
