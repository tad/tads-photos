import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Slideshow } from "../Slideshow";
import type { Photo } from "@/types/photo";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="slideshow-image" />
  ),
}));

// Mock the useFullscreen hook
vi.mock("@/hooks/useFullscreen", () => ({
  useFullscreen: () => ({
    isFullscreen: false,
    toggleFullscreen: vi.fn(),
    exitFullscreen: vi.fn(),
  }),
}));

describe("Slideshow", () => {
  const mockPhotos: Photo[] = [
    { id: "1", src: "/photos/photo1.jpg", filename: "photo1.jpg", width: 800, height: 600 },
    { id: "2", src: "/photos/photo2.jpg", filename: "photo2.jpg", width: 800, height: 600 },
    { id: "3", src: "/photos/photo3.jpg", filename: "photo3.jpg", width: 800, height: 600 },
  ];

  const defaultProps = {
    photos: mockPhotos,
    currentIndex: 0,
    isOpen: true,
    onClose: vi.fn(),
    onIndexChange: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the current photo", () => {
    render(<Slideshow {...defaultProps} />);
    expect(screen.getByAltText("photo1.jpg")).toBeInTheDocument();
  });

  it("should display photo counter", () => {
    render(<Slideshow {...defaultProps} />);
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("should render play/pause button", () => {
    render(<Slideshow {...defaultProps} />);
    expect(screen.getByRole("button", { name: /play slideshow/i })).toBeInTheDocument();
  });

  it("should toggle play/pause when button is clicked", () => {
    render(<Slideshow {...defaultProps} />);

    const playButton = screen.getByRole("button", { name: /play slideshow/i });
    fireEvent.click(playButton);

    expect(screen.getByRole("button", { name: /pause slideshow/i })).toBeInTheDocument();

    const pauseButton = screen.getByRole("button", { name: /pause slideshow/i });
    fireEvent.click(pauseButton);

    expect(screen.getByRole("button", { name: /play slideshow/i })).toBeInTheDocument();
  });

  it("should auto-advance when playing", () => {
    const onIndexChange = vi.fn();
    render(<Slideshow {...defaultProps} onIndexChange={onIndexChange} />);

    // Start playing
    const playButton = screen.getByRole("button", { name: /play slideshow/i });
    fireEvent.click(playButton);

    // Advance timer by 5 seconds (default interval)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("should start auto-playing when autoPlay prop is true", () => {
    const onIndexChange = vi.fn();
    render(<Slideshow {...defaultProps} onIndexChange={onIndexChange} autoPlay />);

    // Should show pause button immediately
    expect(screen.getByRole("button", { name: /pause slideshow/i })).toBeInTheDocument();

    // Advance timer
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("should pause auto-play when previous button is clicked", () => {
    const onIndexChange = vi.fn();
    render(<Slideshow {...defaultProps} onIndexChange={onIndexChange} autoPlay />);

    // Initially playing
    expect(screen.getByRole("button", { name: /pause slideshow/i })).toBeInTheDocument();

    // Click previous button
    const prevButton = screen.getByRole("button", { name: /previous photo/i });
    fireEvent.click(prevButton);

    // Should now be paused
    expect(screen.getByRole("button", { name: /play slideshow/i })).toBeInTheDocument();
  });

  it("should pause auto-play when next button is clicked", () => {
    const onIndexChange = vi.fn();
    render(<Slideshow {...defaultProps} onIndexChange={onIndexChange} autoPlay />);

    // Initially playing
    expect(screen.getByRole("button", { name: /pause slideshow/i })).toBeInTheDocument();

    // Click next button
    const nextButton = screen.getByRole("button", { name: /next photo/i });
    fireEvent.click(nextButton);

    // Should now be paused
    expect(screen.getByRole("button", { name: /play slideshow/i })).toBeInTheDocument();
  });

  it("should use custom autoPlayInterval", () => {
    const onIndexChange = vi.fn();
    render(
      <Slideshow
        {...defaultProps}
        onIndexChange={onIndexChange}
        autoPlay
        autoPlayInterval={2000}
      />
    );

    // Should not advance before 2 seconds
    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(onIndexChange).not.toHaveBeenCalled();

    // Should advance at 2 seconds
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("should loop back to first photo after last", () => {
    const onIndexChange = vi.fn();
    render(
      <Slideshow
        {...defaultProps}
        currentIndex={2}
        onIndexChange={onIndexChange}
        autoPlay
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should loop back to index 0
    expect(onIndexChange).toHaveBeenCalledWith(0);
  });
});
