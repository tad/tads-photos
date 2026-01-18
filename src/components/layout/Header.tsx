"use client";

import { Camera } from "lucide-react";

interface HeaderProps {
  photoCount?: number;
}

export function Header({ photoCount }: HeaderProps) {
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
          {photoCount !== undefined && (
            <span className="text-sm text-muted">
              {photoCount} {photoCount === 1 ? "photo" : "photos"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
