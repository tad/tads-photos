import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];

async function migrate() {
  console.log("Starting migration to Vercel Blob...\n");

  // Check for BLOB_READ_WRITE_TOKEN
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Error: BLOB_READ_WRITE_TOKEN environment variable is required");
    console.error("Get this from your Vercel project's Storage tab");
    process.exit(1);
  }

  // Check if photos directory exists
  try {
    await fs.access(PHOTOS_DIR);
  } catch {
    console.error(`Error: Photos directory not found at ${PHOTOS_DIR}`);
    process.exit(1);
  }

  // Get all image files
  const files = await fs.readdir(PHOTOS_DIR);
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log("No images found in public/photos/");
    return;
  }

  console.log(`Found ${imageFiles.length} images to migrate:\n`);

  let uploaded = 0;
  let failed = 0;

  for (const filename of imageFiles) {
    const filePath = path.join(PHOTOS_DIR, filename);

    try {
      const fileBuffer = await fs.readFile(filePath);
      const stats = await fs.stat(filePath);

      console.log(`Uploading: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

      const blob = await put(filename, fileBuffer, {
        access: "public",
      });

      console.log(`  -> ${blob.url}\n`);
      uploaded++;
    } catch (error) {
      console.error(`  Failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
      failed++;
    }
  }

  console.log("\n--- Migration Complete ---");
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Failed: ${failed}`);

  if (uploaded > 0) {
    console.log("\nNext steps:");
    console.log("1. Deploy your app to Vercel");
    console.log("2. Test the gallery to ensure photos load from Blob storage");
    console.log("3. (Optional) Remove local photos from public/photos/ after verifying");
  }
}

migrate().catch(console.error);
