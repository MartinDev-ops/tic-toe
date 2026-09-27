import { EMPTY_BOARD, calculateWinner, isBoardFull, playerForMove } from './gameLogic';
import { BOT_PLAYER } from './botLogic';

// Action types, kept in one place so components and reducer can't drift apart.
export const ACTIONS = {
  MAKE_MOVE: 'MAKE_MOVE',
  JUMP_TO: 'JUMP_TO',
  RESET_BOARD: 'RESET_BOARD',
  RESET_SCORES: 'RESET_SCORES',
  SET_MODE: 'SET_MODE',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
};

// Centralised game state:
//  - history:     one board snapshot per move (index 0 = empty board)
//  - currentMove: which snapshot is currently displayed (enables time travel)
//  - scores:      running tally, only updated once per finished game
//  - mode:        'pvp' (two players) or 'bot' (X vs the computer as O)
//  - difficulty:  'easy' or 'hard', used when mode is 'bot'
export const initialGameState = {
  history: [EMPTY_BOARD],
  currentMove: 0,
  scores: { X: 0, O: 0, draws: 0 },
  mode: 'pvp',
  difficulty: 'easy',
};

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_MOVE: {
      const { index } = action;
      const currentSquares = state.history[state.currentMove];

      // Ignore clicks once the game is decided, or on a filled square.
      if (calculateWinner(currentSquares) || currentSquares[index]) {
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
      const nextHistory = [
        ...state.history.slice(0, state.currentMove + 1),
        nextSquares,
      ];

      let scores = state.scores;
      const result = calculateWinner(nextSquares);
      if (result) {
        scores = { ...scores, [result.winner]: scores[result.winner] + 1 };
      } else if (isBoardFull(nextSquares)) {
        scores = { ...scores, draws: scores.draws + 1 };
      }

      return {
        ...state,
        history: nextHistory,
        currentMove: nextHistory.length - 1,
        scores,
      };
    }

    case ACTIONS.JUMP_TO: {
      return { ...state, currentMove: action.move };
    }

    case ACTIONS.RESET_BOARD: {
      // Restart the current game but keep the scoreboard totals.
      return { ...state, history: [EMPTY_BOARD], currentMove: 0 };
    }

    case ACTIONS.RESET_SCORES: {
      return { ...state, scores: { X: 0, O: 0, draws: 0 } };
    }

    case ACTIONS.SET_MODE: {
      // Switching mode starts a fresh board; scores are kept.
      return { ...state, mode: action.mode, history: [EMPTY_BOARD], currentMove: 0 };
    }

    case ACTIONS.SET_DIFFICULTY: {
      return { ...state, difficulty: action.difficulty };
    }

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
