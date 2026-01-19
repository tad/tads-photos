"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Play, Pause, Shuffle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useAutoSlideshow } from "@/hooks/useAutoSlideshow";
import { useRandomOrder } from "@/hooks/useRandomOrder";
import type { Photo } from "@/types/photo";

const INTERVAL_OPTIONS = [
  { value: 3000, label: "3s" },
  { value: 5000, label: "5s" },
  { value: 10000, label: "10s" },
];

interface SlideshowProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function Slideshow({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  autoPlay = false,
  autoPlayInterval = 5000,
}: SlideshowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen(containerRef);

  const [interval, setInterval] = useState(autoPlayInterval);
  const [isRandomMode, setIsRandomMode] = useState(false);

  const { getNextIndex, reset: resetRandomOrder } = useRandomOrder({
    totalPhotos: photos.length,
    currentIndex,
    enabled: isRandomMode,
  });

  const currentPhoto = photos[currentIndex];

  const goToNext = useCallback(() => {
    const nextIndex = getNextIndex();
    onIndexChange(nextIndex);
  }, [getNextIndex, onIndexChange]);

  const goToPrevious = useCallback(() => {
    onIndexChange((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onIndexChange]);

  const { isPlaying, play, pause, toggle: togglePlay } = useAutoSlideshow({
    isActive: isOpen,
    interval,
    onAdvance: goToNext,
  });

  const handleRandomToggle = useCallback(() => {
    setIsRandomMode((prev) => {
      if (!prev) {
        // Turning on random mode - reset the shown set
        resetRandomOrder();
      }
      return !prev;
    });
  }, [resetRandomOrder]);

  // Start auto-play if autoPlay prop is true when slideshow opens
  const hasStartedAutoPlay = useRef(false);
  if (isOpen && autoPlay && !hasStartedAutoPlay.current) {
    hasStartedAutoPlay.current = true;
    play();
  }
  if (!isOpen) {
    hasStartedAutoPlay.current = false;
  }

  const handleClose = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    }
    onClose();
  }, [isFullscreen, exitFullscreen, onClose]);

  const handleManualPrevious = useCallback(() => {
    pause();
    goToPrevious();
  }, [pause, goToPrevious]);

  const handleManualNext = useCallback(() => {
    pause();
    goToNext();
  }, [pause, goToNext]);

  useKeyboardNavigation({
    isActive: isOpen,
    onNext: goToNext,
    onPrevious: goToPrevious,
    onClose: handleClose,
    onTogglePlay: togglePlay,
  });

  const handleDoubleClick = useCallback(() => {
    toggleFullscreen();
  }, [toggleFullscreen]);

  if (!currentPhoto) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div
        ref={containerRef}
        className="relative flex h-full w-full items-center justify-center bg-black"
        onDoubleClick={handleDoubleClick}
      >
        {/* Navigation buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleManualPrevious();
              }}
              className="absolute left-4 z-10 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleManualNext();
              }}
              className="absolute right-4 z-10 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
              aria-label="Next photo"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        {/* Photo counter */}
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
          {currentIndex + 1} of {photos.length}
        </div>

        {/* Slideshow controls */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          {/* Play/Pause toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>

          {/* Interval selector and shuffle - only visible when playing */}
          {isPlaying && (
            <>
              <select
                value={interval}
                onChange={(e) => {
                  e.stopPropagation();
                  setInterval(Number(e.target.value));
                }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-black/50 px-3 py-2 text-sm text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Slideshow interval"
              >
                {INTERVAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRandomToggle();
                }}
                className={`rounded-full p-2 text-white transition-colors ${
                  isRandomMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-black/50 hover:bg-black/70"
                }`}
                aria-label={isRandomMode ? "Disable random order" : "Enable random order"}
                aria-pressed={isRandomMode}
              >
                <Shuffle className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Fullscreen toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}
          className="absolute bottom-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </button>

        {/* Main image */}
        <div className="relative h-[85vh] w-[90vw]">
          <Image
            src={currentPhoto.src}
            alt={currentPhoto.filename}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </Modal>
  );
}
