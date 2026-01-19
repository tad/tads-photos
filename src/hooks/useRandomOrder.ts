"use client";

import { useRef, useCallback } from "react";

interface UseRandomOrderProps {
  totalPhotos: number;
  currentIndex: number;
  enabled: boolean;
}

interface UseRandomOrderReturn {
  getNextIndex: () => number;
  reset: () => void;
}

export function useRandomOrder({
  totalPhotos,
  currentIndex,
  enabled,
}: UseRandomOrderProps): UseRandomOrderReturn {
  const shownIndicesRef = useRef<Set<number>>(new Set());

  const getNextIndex = useCallback((): number => {
    if (!enabled) {
      return (currentIndex + 1) % totalPhotos;
    }

    // Handle single photo case
    if (totalPhotos === 1) {
      return 0;
    }

    // Mark current photo as shown
    shownIndicesRef.current.add(currentIndex);

    // Get all unshown indices
    const unshownIndices: number[] = [];
    for (let i = 0; i < totalPhotos; i++) {
      if (!shownIndicesRef.current.has(i)) {
        unshownIndices.push(i);
      }
    }

    // If all photos have been shown, reset and pick from all except current
    if (unshownIndices.length === 0) {
      shownIndicesRef.current.clear();
      shownIndicesRef.current.add(currentIndex);
      for (let i = 0; i < totalPhotos; i++) {
        if (i !== currentIndex) {
          unshownIndices.push(i);
        }
      }
    }

    // Pick a random index from unshown
    const randomIndex = Math.floor(Math.random() * unshownIndices.length);
    return unshownIndices[randomIndex];
  }, [totalPhotos, currentIndex, enabled]);

  const reset = useCallback(() => {
    shownIndicesRef.current.clear();
  }, []);

  return { getNextIndex, reset };
}
