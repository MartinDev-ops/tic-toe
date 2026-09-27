// Required advanced feature: "Move History + Time Travel".
// Renders one button per snapshot in history; clicking a button dispatches
// JUMP_TO so the board re-renders at that point in the game.
export default function MoveHistory({ history, currentMove, onJumpTo }) {
  return (
    <section className="panel move-history" aria-label="Move history">
      <h2 className="panel__title">Move history</h2>
      <ol className="move-history__list">
        {history.map((_, move) => {
          const isCurrent = move === currentMove;
          const label = move === 0 ? 'Go to game start' : `Go to move #${move}`;

          return (
            <li key={move}>
              <button
                type="button"
                className={`move-history__button${isCurrent ? ' move-history__button--current' : ''}`}
                onClick={() => onJumpTo(move)}
                disabled={isCurrent}
              >
                {label}
                {isCurrent ? ' (current)' : ''}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
