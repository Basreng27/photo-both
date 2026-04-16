import { useState, useRef, useCallback } from 'react';
import {
  COUNTDOWN_SECONDS,
  CAPTURE_DELAY_MS,
  CAPTURE_RESET_DELAY_MS,
} from '../constants';

interface UseCountdownReturn {
  countdown: number | null;
  isCapturing: boolean;
  startCountdown: () => void;
}

/**
 * Manages the per-photo countdown and triggers the capture signal.
 * Counts down from COUNTDOWN_SECONDS, then briefly sets isCapturing=true
 * so the Camera component knows to snap a frame.
 */
export function useCountdown(): UseCountdownReturn {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerCapture = useCallback(() => {
    setCountdown(0);
    timerRef.current = setTimeout(() => {
      setIsCapturing(true);
      timerRef.current = setTimeout(() => {
        setIsCapturing(false);
        setCountdown(null);
      }, CAPTURE_RESET_DELAY_MS);
    }, CAPTURE_DELAY_MS);
  }, []);

  const startCountdown = useCallback(() => {
    let remaining = COUNTDOWN_SECONDS;
    setCountdown(remaining);

    const tick = () => {
      remaining -= 1;
      if (remaining > 0) {
        setCountdown(remaining);
        timerRef.current = setTimeout(tick, 1000);
      } else {
        triggerCapture();
      }
    };

    timerRef.current = setTimeout(tick, 1000);
  }, [triggerCapture]);

  return { countdown, isCapturing, startCountdown };
}
