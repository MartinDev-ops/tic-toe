// Feature: "Player Name Input". Names replace X / O in the status line,
// the scoreboard and the move history. Against the computer, O is locked.
export default function PlayerNames({ names, mode, onNameChange }) {
  return (
    <section className="panel player-names" aria-label="Player names">
      <h2 className="panel__title">Players</h2>
      <label className="player-names__field">
        <span className="player-names__symbol">X</span>
        <input
          type="text"
          value={names.X}
          maxLength={16}
          placeholder="Player X name"
          onChange={(event) => onNameChange('X', event.target.value)}
        />
      </label>
      <label className="player-names__field">
        <span className="player-names__symbol">O</span>
        <input
          type="text"
          value={mode === 'bot' ? 'Computer' : names.O}
          maxLength={16}
          placeholder="Player O name"
          disabled={mode === 'bot'}
          onChange={(event) => onNameChange('O', event.target.value)}
        />
      </label>
    </section>
  );
}
