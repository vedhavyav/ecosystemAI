import { useState, useEffect } from 'react';

/**
 * Custom hook to smoothly animate a number over a duration.
 * Uses requestAnimationFrame with an easeOutCubic easing function.
 */
export function useAnimatedValue(endValue: number, durationMs: number = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    // We capture the current state for the start value so interpolation begins where it left off
    const startValue = value;
    const distance = endValue - startValue;

    if (distance === 0) return;
    if (durationMs === 0) {
      queueMicrotask(() => setValue(endValue));
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);

      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setValue(startValue + distance * ease);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setValue(endValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endValue, durationMs]);

  return Math.round(value);
}
