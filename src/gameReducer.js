import { EMPTY_BOARD, getOutcome, playerForMove } from './gameLogic';
import { BOT_PLAYER } from './botLogic';

// Action types, kept in one place so components and reducer can't drift apart.
export const ACTIONS = {
  MAKE_MOVE: 'MAKE_MOVE',
  UNDO: 'UNDO',
  JUMP_TO: 'JUMP_TO',
  TIME_UP: 'TIME_UP',
  RESET_BOARD: 'RESET_BOARD',
  RESET_SCORES: 'RESET_SCORES',
  SET_MODE: 'SET_MODE',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  SET_TIMER: 'SET_TIMER',
  SET_PLAYER_NAME: 'SET_PLAYER_NAME',
};

const EMPTY_SCORES = { X: 0, O: 0, draws: 0 };

// A fresh game: empty board, nobody timed out, result not yet scored.
const NEW_GAME = {
  history: [EMPTY_BOARD],
  currentMove: 0,
  timedOut: null,
  scored: false,
};

// Centralised game state:
//  - history:      one board snapshot per move (index 0 = empty board)
//  - currentMove:  which snapshot is currently displayed (enables time travel)
//  - timedOut:     the player who ran out of time, or null
//  - scored:       whether this game's result is already on the scoreboard,
//                  so undo / time travel can't count the same game twice
//  - scores:       running tally across games
//  - names:        optional player names shown instead of X / O
//  - mode:         'pvp' (two players) or 'bot' (X vs the computer as O)
//  - difficulty:   'easy' or 'hard', used when mode is 'bot'
//  - timerEnabled: whether each turn is time-limited
export const initialGameState = {
  ...NEW_GAME,
  scores: EMPTY_SCORES,
  names: { X: '', O: '' },
  mode: 'pvp',
  difficulty: 'easy',
  timerEnabled: false,
};

// Adds the finished game's result to the scoreboard, once per game.
function recordResult(state) {
  const outcome = getOutcome(state.history[state.currentMove], state.timedOut);
  if (!outcome.over || state.scored) return state;

  const key = outcome.winner ?? 'draws';
  return {
    ...state,
    scored: true,
    scores: { ...state.scores, [key]: state.scores[key] + 1 },
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_MOVE: {
      const { index } = action;
      const currentSquares = state.history[state.currentMove];

      // Ignore clicks once the game is decided, or on a filled square.
      if (getOutcome(currentSquares, state.timedOut).over || currentSquares[index]) {
        return state;
      }

      const player = playerForMove(state.currentMove);

      // Against the computer, only the bot may place O.
      if (state.mode === 'bot' && player === BOT_PLAYER && !action.byBot) {
        return state;
      }

      const nextSquares = currentSquares.slice();
      nextSquares[index] = player;

      // Making a move from an earlier point in history discards any
      // "future" moves that came after it (standard time-travel behaviour).
      const nextHistory = [...state.history.slice(0, state.currentMove + 1), nextSquares];

      return recordResult({
        ...state,
        history: nextHistory,
        currentMove: nextHistory.length - 1,
      });
    }

    case ACTIONS.UNDO: {
      if (state.currentMove === 0) return state;

      // Against the computer, undo back to the human's turn so the bot
      // doesn't immediately replay its move.
      let target = state.currentMove - 1;
      if (state.mode === 'bot' && target > 0 && playerForMove(target) === BOT_PLAYER) {
        target -= 1;
      }

      return {
        ...state,
        history: state.history.slice(0, target + 1),
        currentMove: target,
        timedOut: null,
      };
    }

    case ACTIONS.JUMP_TO: {
      return { ...state, currentMove: action.move, timedOut: null };
    }

    case ACTIONS.TIME_UP: {
      const squares = state.history[state.currentMove];
      if (getOutcome(squares, state.timedOut).over) return state;
      return recordResult({ ...state, timedOut: playerForMove(state.currentMove) });
    }

    case ACTIONS.RESET_BOARD: {
      // Restart the current game but keep the scoreboard totals.
      return { ...state, ...NEW_GAME };
    }

    case ACTIONS.RESET_SCORES: {
      return { ...state, scores: EMPTY_SCORES };
    }

    case ACTIONS.SET_MODE: {
      // Switching mode starts a fresh board; scores are kept.
      return { ...state, ...NEW_GAME, mode: action.mode };
    }

    case ACTIONS.SET_DIFFICULTY: {
      return { ...state, difficulty: action.difficulty };
    }

    case ACTIONS.SET_TIMER: {
      return { ...state, timerEnabled: action.enabled };
    }

    case ACTIONS.SET_PLAYER_NAME: {
      return { ...state, names: { ...state.names, [action.player]: action.name } };
    }

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
