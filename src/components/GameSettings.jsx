// Game settings: mode (advanced feature "Play vs Computer"), bot difficulty
// and the turn timer. Presentational only - it shows the current settings
// and reports changes upward.
const MODES = [
  { value: 'pvp', label: '2 Players' },
  { value: 'bot', label: 'vs Computer' },
];

const TIMER_OPTIONS = [
  { value: 'off', label: 'No timer' },
  { value: 'on', label: '10s per turn' },
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

export default function GameSettings({
  mode,
  difficulty,
  timerEnabled,
  onModeChange,
  onDifficultyChange,
  onTimerChange,
}) {
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
      <SegmentedControl
        label="Turn timer"
        options={TIMER_OPTIONS}
        value={timerEnabled ? 'on' : 'off'}
        onChange={(value) => onTimerChange(value === 'on')}
      />
    </div>
  );
}
