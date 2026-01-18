"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseAutoSlideshowProps {
  isActive: boolean;
  interval?: number;
  onAdvance: () => void;
}

interface UseAutoSlideshowReturn {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

export function useAutoSlideshow({
  isActive,
  interval = 5000,
  onAdvance,
}: UseAutoSlideshowProps): UseAutoSlideshowReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isActive && isPlaying) {
      intervalRef.current = setInterval(() => {
        onAdvance();
      }, interval);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isActive, isPlaying, interval, onAdvance, clearTimer]);

  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
    }
  }, [isActive]);

  return { isPlaying, play, pause, toggle };
}
