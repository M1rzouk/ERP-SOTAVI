import { useEffect, useRef } from 'react';

/**
 * Hook that triggers a callback after a period of inactivity.
 * @param {number} timeoutMs - Inactivity timeout in milliseconds.
 * @param {Function} onTimeout - Callback when timeout is reached.
 */
export function useIdleTimeout(timeoutMs, onTimeout) {
  const timerRef = useRef(null);
  const onTimeoutRef = useRef(onTimeout);

  // Keep callback reference fresh
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onTimeoutRef.current();
    }, timeoutMs);
  };

  useEffect(() => {
    // List of events that indicate user activity
    const events = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
      'wheel',
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // Attach listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Start the initial timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeoutMs]); // eslint-disable-line react-hooks/exhaustive-deps

  // We don't return anything, but we could expose a manual reset if needed.
}