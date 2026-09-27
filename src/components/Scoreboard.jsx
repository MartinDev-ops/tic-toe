// Required feature: "Scoreboard (X wins / O wins / draws)".
// Purely presentational - it just displays the scores object it is given.
export default function Scoreboard({ scores, onResetScores }) {
  return (
    <section className="panel scoreboard" aria-label="Scoreboard">
      <h2 className="panel__title">Scoreboard</h2>
      <dl className="scoreboard__grid">
        <div className="scoreboard__item">
          <dt>Player X</dt>
          <dd>{scores.X}</dd>
        </div>
        <div className="scoreboard__item">
          <dt>Player O</dt>
          <dd>{scores.O}</dd>
        </div>
        <div className="scoreboard__item">
          <dt>Draws</dt>
          <dd>{scores.draws}</dd>
        </div>
      </dl>
      <button type="button" className="link-button" onClick={onResetScores}>
        Reset scoreboard
      </button>
    </section>
  );
}
