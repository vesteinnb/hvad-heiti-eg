import { useState, useEffect, useRef } from 'react';

interface UseGameTimerReturn {
  timer: string;
  startTime: number | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export const useGameTimer = (isActive: boolean = true): UseGameTimerReturn => {
  const [timer, setTimer] = useState('00:00');
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    const now = Date.now();
    setStartTime(now);
  };

  const stop = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const reset = () => {
    stop();
    setTimer('00:00');
    setStartTime(null);
  };

  // Timer logic
  useEffect(() => {
    if (startTime && isActive) {
      timerInterval.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    } else {
      stop();
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [startTime, isActive]);

  return {
    timer,
    startTime,
    start,
    stop,
    reset,
  };
};