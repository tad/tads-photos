# Tad's Photos

A modern, minimalist photo gallery built with Next.js. Features a responsive grid layout, slideshow viewer, and fullscreen mode—all with a sleek dark theme designed to make your photos pop.

## Features

- **Responsive Grid** — Automatically adjusts from 1 column on mobile to 5 columns on desktop
- **Slideshow Viewer** — Click any photo to view it large with easy navigation
- **Auto Slideshow** — Hands-free viewing with adjustable intervals (3s, 5s, 10s) and random shuffle mode
- **Keyboard Navigation** — Use arrow keys to browse, Space to play/pause, Escape to close
- **Fullscreen Mode** — Double-click any photo for immersive fullscreen viewing
- **Dark Theme** — Easy on the eyes, great for photography
- **Automatic Discovery** — Just drop photos in a folder and they appear
- **Admin Dashboard** — Password-protected upload and delete functionality
- **Vercel Blob Storage** — Cloud storage for photos, ready for deployment

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your photos**

   Place your images in the `public/photos/` directory. Supported formats:
   - JPEG (.jpg, .jpeg)
   - PNG (.png)
   - GIF (.gif)
   - WebP (.webp)
   - AVIF (.avif)

3. **Start the app**
   ```bash
   npm run dev
   ```

4. **Open in browser**

   Visit [http://localhost:3000](http://localhost:3000)

## Usage

| Action | How |
|--------|-----|
| Open slideshow | Click any photo |
| Start auto slideshow | Click "Slideshow" button in header |
| Play/pause slideshow | Click play/pause button or press Space |
| Change slideshow speed | Select 3s, 5s, or 10s from dropdown (while playing) |
| Shuffle photos | Click shuffle button to randomize order (while playing) |
| Next photo | Click right arrow or press → |
| Previous photo | Click left arrow or press ← |
| Close slideshow | Click X or press Escape |
| Enter fullscreen | Double-click photo or click maximize button |
| Exit fullscreen | Press Escape or click minimize button |

## Production Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. **Push to GitHub** and import in the [Vercel dashboard](https://vercel.com/new)

2. **Create Blob storage** in the Vercel project's Storage tab (auto-sets `BLOB_READ_WRITE_TOKEN`)

3. **Add environment variable** `ADMIN_PASSWORD` with your chosen password

4. **Migrate existing photos** (optional):
   ```bash
   BLOB_READ_WRITE_TOKEN=xxx npm run migrate
   ```

5. **Deploy** — photos are now served from Vercel Blob

### Admin Dashboard

Visit `/admin/login` to access the admin dashboard where you can upload and delete photos.

## Tech Stack

- [Next.js 15](https://nextjs.org/) — React framework
- [Tailwind CSS 4](https://tailwindcss.com/) — Styling
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — Cloud storage
- [Sharp](https://sharp.pixelplumbing.com/) — Image processing
- [Lucide](https://lucide.dev/) — Icons

## License

MIT
