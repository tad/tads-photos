"use client";

import { useEffect, useCallback } from "react";

interface UseKeyboardNavigationProps {
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onTogglePlay?: () => void;
}

export function useKeyboardNavigation({
  isActive,
  onNext,
  onPrevious,
  onClose,
  onTogglePlay,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onPrevious();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        case " ":
          event.preventDefault();
          onTogglePlay?.();
          break;
      }
    },
    [isActive, onNext, onPrevious, onClose, onTogglePlay]
  );

  useEffect(() => {
    if (isActive) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isActive, handleKeyDown]);
}
