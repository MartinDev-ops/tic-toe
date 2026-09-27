// Advanced feature: "Turn Timer". Shows the seconds left for the current
// player as a number and a shrinking bar that turns red near the end.
export default function TurnTimer({ secondsLeft, totalSeconds, playerLabel, paused }) {
  const percent = Math.max(0, (secondsLeft / totalSeconds) * 100);
  const urgent = secondsLeft <= 3 && !paused;

  return (
    <div className={`turn-timer${urgent ? ' turn-timer--urgent' : ''}`}>
      <div className="turn-timer__text">
        <span>{paused ? 'Timer paused' : `${playerLabel}'s turn`}</span>
        <span className="turn-timer__seconds">{secondsLeft}s</span>
      </div>
      <div className="turn-timer__track">
        <div className="turn-timer__bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
