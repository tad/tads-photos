# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-01-19

### Added

- Vercel Blob storage integration for cloud photo hosting
- Password-protected admin dashboard at `/admin`
- Photo upload functionality with drag-and-drop support
- Photo delete functionality from admin dashboard
- Migration script to upload existing photos to Blob storage (`npm run migrate`)
- Middleware for admin route protection

### Changed

- Photos API now fetches from Vercel Blob instead of local filesystem
- Photo type includes optional `uploadedAt` timestamp

## [0.3.0] - 2026-01-18

### Added

- Slideshow interval selector with 3s, 5s, and 10s options
- Shuffle mode for random photo order (shows all photos before repeating)
- New `useRandomOrder` hook for random selection logic
- Unit tests for slideshow controls (17 new tests, 51 total)

### Changed

- Slideshow controls (interval and shuffle) only visible during auto-play
- Shuffle button highlights when active

## [0.2.0] - 2026-01-18

### Added

- Auto slideshow feature with 5-second intervals and continuous looping
- "Slideshow" button in header to start auto-play from first photo
- Play/pause button in slideshow viewer (bottom-left)
- Space key support for toggling play/pause
- Testing framework with Vitest and React Testing Library
- Unit tests for hooks and components (34 tests)

### Changed

- Clicking prev/next buttons now pauses auto-play
- Extended keyboard navigation to support Space key

## [0.1.0] - 2026-01-18

### Added

- Initial release
- Photo grid with responsive layout (1-5 columns based on viewport)
- Slideshow modal with prev/next navigation
- Keyboard navigation (← → arrows, Escape to close)
- Fullscreen mode (double-click or button)
- Dark theme optimized for photo viewing
- Photo API that auto-discovers images in `public/photos/`
- Support for JPEG, PNG, GIF, WebP, and AVIF formats
- Image dimension extraction via Sharp
- Next.js Image optimization with lazy loading
