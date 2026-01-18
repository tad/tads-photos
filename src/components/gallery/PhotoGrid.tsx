"use client";

import { PhotoCard } from "./PhotoCard";
import type { Photo } from "@/types/photo";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-muted">No photos found</p>
        <p className="mt-2 text-sm text-muted">
          Add images to the <code className="rounded bg-card px-2 py-1">public/photos</code> directory
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onClick={() => onPhotoClick(index)}
          priority={index < 10}
        />
      ))}
    </div>
  );
}
