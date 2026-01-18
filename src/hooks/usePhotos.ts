"use client";

import { useState, useEffect } from "react";
import type { Photo, PhotosResponse } from "@/types/photo";

interface UsePhotosReturn {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

export function usePhotos(): UsePhotosReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/photos");

        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }

        const data: PhotosResponse = await response.json();
        setPhotos(data.photos);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  return { photos, isLoading, error, total };
}
