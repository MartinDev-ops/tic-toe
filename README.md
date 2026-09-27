# Tic Tac Toe (React)

A Tic Tac Toe game built with React, hooks and `useReducer` for state
management.

## Features implemented

**1. Base game (React)**
- 3x3 board, players alternate X and O
- Filled squares can't be overwritten
- Detects a win (row, column or diagonal) and a draw (board full, no winner)
- Status line reads exactly `Next Player: X`, `Winner: O`, or `Draw!`
- Winning squares are highlighted
- Clean, responsive UI (desktop and mobile), with a hover effect on empty
  squares

**2. Feature without AI tools: Scoreboard**
- Tracks X wins / O wins / draws across games
- "Restart game" clears the board but keeps the score
- "Reset scoreboard" clears the tallies

**3. State management: `useReducer`**
- All game state (`history`, `currentMove`, `scores`) lives in one reducer:
  `src/gameReducer.js`
- Actions: `MAKE_MOVE`, `JUMP_TO`, `RESET_BOARD`, `RESET_SCORES`,
  `SET_MODE`, `SET_DIFFICULTY`
- Win/draw rules live in one place, `src/gameLogic.js`, and are reused by
  both the reducer and the UI (no duplicated logic)
- `Board`, `Square`, `Scoreboard` and `MoveHistory` are presentational
  ("dumb") components — they only receive props and call callbacks

**4. Advanced feature: Move history + time travel**
- Every move is stored as a board snapshot
- Click any entry in "Move history" to jump back to that point in the game
- Making a new move from an earlier point branches the game from there

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
    └── components/
        ├── Board.jsx
        ├── Square.jsx
        ├── Scoreboard.jsx
        ├── GameModeSettings.jsx
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
4. The move history / time travel feature
5. Playing against the computer on Easy and Hard
