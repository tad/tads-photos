"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { Slideshow } from "@/components/gallery/Slideshow";
import { usePhotos } from "@/hooks/usePhotos";

export default function Home() {
  const { photos, isLoading, error, total } = usePhotos();
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
  const [autoPlayMode, setAutoPlayMode] = useState(false);

  const handlePhotoClick = (index: number) => {
    setAutoPlayMode(false);
    setSlideshowIndex(index);
  };

  const handleCloseSlideshow = () => {
    setSlideshowIndex(null);
    setAutoPlayMode(false);
  };

  const handleStartSlideshow = () => {
    setSlideshowIndex(0);
    setAutoPlayMode(true);
  };

  return (
    <main className="min-h-screen">
      <Header
        photoCount={total}
        onStartSlideshow={handleStartSlideshow}
        hasPhotos={photos.length > 0}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-red-500">Error loading photos</p>
            <p className="mt-2 text-sm text-muted">{error}</p>
          </div>
        ) : (
          <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
        )}
      </div>

      {slideshowIndex !== null && (
        <Slideshow
          photos={photos}
          currentIndex={slideshowIndex}
          isOpen={slideshowIndex !== null}
          onClose={handleCloseSlideshow}
          onIndexChange={setSlideshowIndex}
          autoPlay={autoPlayMode}
        />
      )}
    </main>
  );
}
