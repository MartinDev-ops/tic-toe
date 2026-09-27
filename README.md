# Tic Tac Toe (React)

A Tic Tac Toe game built with React, hooks and `useReducer` for state
management.

## Features implemented

**1. Base game**
- 3x3 board, players alternate X and O
- Filled squares can't be overwritten
- Detects a win (row, column or diagonal) and a draw (board full, no winner)
- Status line reads `Next Player: X`, `Winner: O`, or `Draw!`
  (with player names, e.g. `Winner: Alice (X)`)
- Winning squares are highlighted and the result shows as a banner
- Responsive layout (desktop and mobile), hover effect on empty squares

**2. Player features**
- **Restart game**: clears the board, keeps the scores
- **Undo move**: reverts the last move (against the computer it reverts
  your move and the computer's reply)
- **Scoreboard**: X wins / O wins / draws across games; each finished game
  is counted once, even if you undo or time-travel and replay it
- **Player names**: type names for X and O; they replace X / O in the
  status line, scoreboard and move history

**3. State management: `useReducer`**
- All game state lives in one reducer: `src/gameReducer.js`
- Actions: `MAKE_MOVE`, `UNDO`, `JUMP_TO`, `TIME_UP`, `RESET_BOARD`,
  `RESET_SCORES`, `SET_MODE`, `SET_DIFFICULTY`, `SET_TIMER`,
  `SET_PLAYER_NAME` (defined once in the `ACTIONS` object)
- Win / draw / timeout rules live in one function, `getOutcome` in
  `src/gameLogic.js`, used by both the reducer and the UI
- Components are presentational: they receive props and call callbacks

**4. Advanced features**
- **Play vs Computer**: you are X, the computer is O. Easy picks a random
  empty square; Hard uses minimax and never loses (`src/botLogic.js`)
- **Turn timer**: optional 10 seconds per turn with a countdown bar; if time
  runs out, that player loses (`src/hooks/useTurnTimer.js`)
- **Move history + time travel**: every move is listed (e.g.
  `#3: X at row 1, col 2`); click one to jump back to that board. Playing
  from an earlier point branches the game from there

## Project structure

```
tictactoe/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx          entry point
    ├── App.jsx           top-level component, wires state to the UI
    ├── App.css           all styling (no external UI libraries)
    ├── index.css         base/global styles
    ├── gameLogic.js       pure helpers: calculateWinner, isBoardFull, playerForMove
    ├── gameReducer.js     useReducer state + actions
    ├── botLogic.js        computer opponent (random + minimax)
    ├── hooks/
    │   └── useTurnTimer.js   countdown for the turn timer
    └── components/
        ├── Board.jsx
        ├── Square.jsx
        ├── Scoreboard.jsx
        ├── GameSettings.jsx   mode, difficulty, timer
        ├── PlayerNames.jsx
        ├── TurnTimer.jsx
        └── MoveHistory.jsx
```

## Running locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the URL that Vite prints (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview   # serve the built dist/ folder locally to double check it
```

## Deploying (Netlify or Vercel)

**Vercel**
1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com → New Project.
3. Framework preset: Vite. Build command: `npm run build`. Output
   directory: `dist`. Deploy.

**Netlify**
1. Push this folder to a GitHub repo.
2. Add new site → Import an existing project at app.netlify.com.
3. Build command: `npm run build`. Publish directory: `dist`. Deploy.

Once deployed, submit the live link together with the GitHub repo link.

## Recording the walkthrough video

A short screen recording (under 4 minutes, face visible) should cover, in
order:
1. A quick gameplay demo showing a win and a draw
2. The scoreboard feature (the "feature without AI tools")
3. A short tour of `gameReducer.js` / `gameLogic.js` explaining the state
   management approach
4. The advanced features: move history / time travel, playing against the
   computer, and the turn timer
