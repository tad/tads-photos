"use client";

import { Camera, Play } from "lucide-react";

interface HeaderProps {
  photoCount?: number;
  onStartSlideshow?: () => void;
  hasPhotos?: boolean;
}

export function Header({ photoCount, onStartSlideshow, hasPhotos = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="h-8 w-8 text-foreground" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tad&apos;s Photos
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {onStartSlideshow && (
              <button
                onClick={onStartSlideshow}
                disabled={!hasPhotos}
                className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Start slideshow"
              >
                <Play className="h-4 w-4" />
                Slideshow
              </button>
            )}
            {photoCount !== undefined && (
              <span className="text-sm text-muted">
                {photoCount} {photoCount === 1 ? "photo" : "photos"}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
