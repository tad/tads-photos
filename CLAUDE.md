# Tad's Photos

A modern photo portfolio web app with grid view, slideshow, and fullscreen capabilities.

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS 4 with dark mode theme
- **Image Handling:** Next.js Image component + Sharp for optimization
- **Icons:** Lucide React
- **Photo Storage:** `./public/photos/` directory

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with dark theme
│   ├── page.tsx                # Main gallery page (client component)
│   ├── globals.css             # Tailwind imports + CSS variables
│   └── api/photos/
│       └── route.ts            # GET endpoint - scans public/photos/
│
├── components/
│   ├── ui/
│   │   └── Modal.tsx           # Reusable modal overlay
│   ├── gallery/
│   │   ├── PhotoCard.tsx       # Individual photo in grid
│   │   ├── PhotoGrid.tsx       # Responsive grid container
│   │   └── Slideshow.tsx       # Fullscreen photo viewer
│   └── layout/
│       └── Header.tsx          # App header with photo count
│
├── hooks/
│   ├── usePhotos.ts            # Fetches photos from API
│   ├── useFullscreen.ts        # Fullscreen API wrapper
│   └── useKeyboardNavigation.ts # Arrow keys + Escape handling
│
└── types/
    └── photo.ts                # Photo and PhotosResponse interfaces
```

## Key Interfaces

```typescript
interface Photo {
  id: string;        // Filename without extension
  src: string;       // Path like "/photos/image.jpg"
  filename: string;  // Full filename
  width: number;     // Image width in pixels
  height: number;    // Image height in pixels
}
```

## API

**GET /api/photos** - Returns all photos from `public/photos/`

- Scans for: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`
- Uses Sharp to extract image dimensions
- Returns: `{ photos: Photo[], total: number }`

## Features

1. **Grid View** - Responsive 1-5 column grid with hover effects
2. **Slideshow** - Click photo to open modal with prev/next navigation
3. **Keyboard Navigation** - ← → arrows, Escape to close
4. **Fullscreen** - Double-click photo or click maximize button

## Theme

Dark theme with CSS variables defined in `globals.css`:
- `--color-background`: #0a0a0a
- `--color-foreground`: #ededed
- `--color-muted`: #888888
- `--color-card`: #141414
- `--color-overlay`: rgba(0, 0, 0, 0.9)

## Adding Photos

Place images in `public/photos/`. The API automatically discovers them on page load.
