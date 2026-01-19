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

  describe("Slideshow controls", () => {
    it("should not show interval selector when not playing", () => {
      render(<Slideshow {...defaultProps} />);
      expect(screen.queryByRole("combobox", { name: /slideshow interval/i })).not.toBeInTheDocument();
    });

    it("should show interval selector when playing", () => {
      render(<Slideshow {...defaultProps} />);

      const playButton = screen.getByRole("button", { name: /play slideshow/i });
      fireEvent.click(playButton);

      expect(screen.getByRole("combobox", { name: /slideshow interval/i })).toBeInTheDocument();
    });

    it("should not show shuffle button when not playing", () => {
      render(<Slideshow {...defaultProps} />);
      expect(screen.queryByRole("button", { name: /random order/i })).not.toBeInTheDocument();
    });

    it("should show shuffle button when playing", () => {
      render(<Slideshow {...defaultProps} />);

      const playButton = screen.getByRole("button", { name: /play slideshow/i });
      fireEvent.click(playButton);

      expect(screen.getByRole("button", { name: /enable random order/i })).toBeInTheDocument();
    });

    it("should change interval when selector value changes", () => {
      const onIndexChange = vi.fn();
      render(<Slideshow {...defaultProps} onIndexChange={onIndexChange} />);

      // Start playing
      const playButton = screen.getByRole("button", { name: /play slideshow/i });
      fireEvent.click(playButton);

      // Change interval to 3s
      const intervalSelect = screen.getByRole("combobox", { name: /slideshow interval/i });
      fireEvent.change(intervalSelect, { target: { value: "3000" } });

      // Advance by 3 seconds - should trigger advance
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onIndexChange).toHaveBeenCalled();
    });

    it("should toggle shuffle button state when clicked", () => {
      render(<Slideshow {...defaultProps} />);

      // Start playing
      const playButton = screen.getByRole("button", { name: /play slideshow/i });
      fireEvent.click(playButton);

      const shuffleButton = screen.getByRole("button", { name: /enable random order/i });
      expect(shuffleButton).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(shuffleButton);

      expect(screen.getByRole("button", { name: /disable random order/i })).toHaveAttribute("aria-pressed", "true");

      fireEvent.click(screen.getByRole("button", { name: /disable random order/i }));

      expect(screen.getByRole("button", { name: /enable random order/i })).toHaveAttribute("aria-pressed", "false");
    });

    it("should hide controls when paused", () => {
      render(<Slideshow {...defaultProps} />);

      // Start playing
      const playButton = screen.getByRole("button", { name: /play slideshow/i });
      fireEvent.click(playButton);

      // Controls should be visible
      expect(screen.getByRole("combobox", { name: /slideshow interval/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /enable random order/i })).toBeInTheDocument();

      // Pause
      const pauseButton = screen.getByRole("button", { name: /pause slideshow/i });
      fireEvent.click(pauseButton);

      // Controls should be hidden
      expect(screen.queryByRole("combobox", { name: /slideshow interval/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /random order/i })).not.toBeInTheDocument();
    });

    it("should have 3s, 5s, and 10s interval options", () => {
      render(<Slideshow {...defaultProps} />);

      // Start playing
      const playButton = screen.getByRole("button", { name: /play slideshow/i });
      fireEvent.click(playButton);

      const intervalSelect = screen.getByRole("combobox", { name: /slideshow interval/i });
      const options = intervalSelect.querySelectorAll("option");

      expect(options).toHaveLength(3);
      expect(options[0]).toHaveValue("3000");
      expect(options[0]).toHaveTextContent("3s");
      expect(options[1]).toHaveValue("5000");
      expect(options[1]).toHaveTextContent("5s");
      expect(options[2]).toHaveValue("10000");
      expect(options[2]).toHaveTextContent("10s");
    });

    it("should default to 5s interval", () => {
      render(<Slideshow {...defaultProps} />);

      // Start playing
      const playButton = screen.getByRole("button", { name: /play slideshow/i });
      fireEvent.click(playButton);

      const intervalSelect = screen.getByRole("combobox", { name: /slideshow interval/i }) as HTMLSelectElement;
      expect(intervalSelect.value).toBe("5000");
    });
  });
});
