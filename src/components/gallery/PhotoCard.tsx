"use client";

import Image from "next/image";
import type { Photo } from "@/types/photo";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  priority?: boolean;
}

export function PhotoCard({ photo, onClick, priority = false }: PhotoCardProps) {
  return (
    <div
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-card transition-transform duration-200 hover:scale-[1.02]"
      onClick={onClick}
    >
      <Image
        src={photo.src}
        alt={photo.filename}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-all duration-200 group-hover:brightness-110"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </div>
  );
}
