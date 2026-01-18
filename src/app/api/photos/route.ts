import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import type { Photo, PhotosResponse } from "@/types/photo";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];

export async function GET(): Promise<NextResponse<PhotosResponse | { error: string }>> {
  try {
    // Ensure photos directory exists
    try {
      await fs.access(PHOTOS_DIR);
    } catch {
      await fs.mkdir(PHOTOS_DIR, { recursive: true });
      return NextResponse.json({ photos: [], total: 0 });
    }

    const files = await fs.readdir(PHOTOS_DIR);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    });

    const photos: Photo[] = await Promise.all(
      imageFiles.map(async (filename): Promise<Photo> => {
        const filePath = path.join(PHOTOS_DIR, filename);

        // Get image dimensions using Sharp
        let width = 0;
        let height = 0;
        try {
          const metadata = await sharp(filePath).metadata();
          width = metadata.width ?? 0;
          height = metadata.height ?? 0;
        } catch (err) {
          console.error(`Failed to read metadata for ${filename}:`, err);
        }

        return {
          id: filename.replace(/\.[^.]+$/, ""),
          src: `/photos/${filename}`,
          filename,
          width,
          height,
        };
      })
    );

    // Sort by filename
    photos.sort((a, b) => a.filename.localeCompare(b.filename));

    return NextResponse.json({ photos, total: photos.length });
  } catch (error) {
    console.error("Error reading photos directory:", error);
    return NextResponse.json(
      { error: "Failed to load photos" },
      { status: 500 }
    );
  }
}
