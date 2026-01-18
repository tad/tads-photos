# Tad's Photos

A modern, minimalist photo gallery built with Next.js. Features a responsive grid layout, slideshow viewer, and fullscreen mode—all with a sleek dark theme designed to make your photos pop.

## Features

- **Responsive Grid** — Automatically adjusts from 1 column on mobile to 5 columns on desktop
- **Slideshow Viewer** — Click any photo to view it large with easy navigation
- **Keyboard Navigation** — Use arrow keys to browse, Escape to close
- **Fullscreen Mode** — Double-click any photo for immersive fullscreen viewing
- **Dark Theme** — Easy on the eyes, great for photography
- **Automatic Discovery** — Just drop photos in a folder and they appear

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

## Tech Stack

- [Next.js 15](https://nextjs.org/) — React framework
- [Tailwind CSS 4](https://tailwindcss.com/) — Styling
- [Sharp](https://sharp.pixelplumbing.com/) — Image processing
- [Lucide](https://lucide.dev/) — Icons

## License

MIT
