export default function Square({ value, onClick, isWinning, disabled }) {
  const classNames = ['square'];
  if (isWinning) classNames.push('square--winning');

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square filled with ${value}` : 'Empty square'}
    >
      {value}
    </button>
  );
}
