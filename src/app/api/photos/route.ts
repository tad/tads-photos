import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import type { Photo, PhotosResponse } from "@/types/photo";

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];

export async function GET(): Promise<NextResponse<PhotosResponse | { error: string }>> {
  try {
    const { blobs } = await list();

    const photos: Photo[] = blobs
      .filter((blob) => {
        const ext = blob.pathname.substring(blob.pathname.lastIndexOf(".")).toLowerCase();
        return SUPPORTED_EXTENSIONS.includes(ext);
      })
      .map((blob) => {
        const filename = blob.pathname;
        return {
          id: filename.replace(/\.[^.]+$/, ""),
          src: blob.url,
          filename,
          width: 0,
          height: 0,
          uploadedAt: blob.uploadedAt.toISOString(),
        };
      });

    // Sort by filename
    photos.sort((a, b) => a.filename.localeCompare(b.filename));

    return NextResponse.json({ photos, total: photos.length });
  } catch (error) {
    console.error("Error listing photos from Blob storage:", error);
    return NextResponse.json(
      { error: "Failed to load photos" },
      { status: 500 }
    );
  }
}
