// Advanced feature: "Play vs Computer".
// Presentational only - it shows the current mode/difficulty and reports changes.
const MODES = [
  { value: 'pvp', label: '2 Players' },
  { value: 'bot', label: 'vs Computer' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'hard', label: 'Hard' },
];

function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`segmented__button${option.value === value ? ' segmented__button--active' : ''}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function GameModeSettings({ mode, difficulty, onModeChange, onDifficultyChange }) {
  return (
    <div className="game-mode">
      <SegmentedControl label="Game mode" options={MODES} value={mode} onChange={onModeChange} />
      {mode === 'bot' && (
        <SegmentedControl
          label="Computer difficulty"
          options={DIFFICULTIES}
          value={difficulty}
          onChange={onDifficultyChange}
        />
      )}
    </div>
  );
}
