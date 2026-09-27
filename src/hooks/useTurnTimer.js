import { useEffect, useState } from 'react';

// Counts down from `seconds` while `active` is true and calls `onExpire`
// when it reaches zero. The countdown restarts whenever `turnKey` changes
// (a new turn) or the timer is switched back on.
export function useTurnTimer({ seconds, active, turnKey, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    setSecondsLeft(seconds);
  }, [seconds, turnKey, active]);

  useEffect(() => {
    if (!active) return undefined;
    if (secondsLeft <= 0) {
      onExpire();
      return undefined;
    }
    const timer = setTimeout(() => setSecondsLeft((left) => left - 1), 1000);
    return () => clearTimeout(timer);
  }, [active, secondsLeft, onExpire]);

  return secondsLeft;
}
