"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useFullscreen } from "@/hooks/useFullscreen";
import type { Photo } from "@/types/photo";

interface SlideshowProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Slideshow({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
}: SlideshowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen(containerRef);

  const currentPhoto = photos[currentIndex];

  const goToNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onIndexChange]);

  const goToPrevious = useCallback(() => {
    onIndexChange((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onIndexChange]);

  const handleClose = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    }
    onClose();
  }, [isFullscreen, exitFullscreen, onClose]);

  useKeyboardNavigation({
    isActive: isOpen,
    onNext: goToNext,
    onPrevious: goToPrevious,
    onClose: handleClose,
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
                goToPrevious();
              }}
              className="absolute left-4 z-10 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
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
