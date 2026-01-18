import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "../Header";

describe("Header", () => {
  it("should render the title", () => {
    render(<Header />);
    expect(screen.getByText("Tad's Photos")).toBeInTheDocument();
  });

  it("should display photo count when provided", () => {
    render(<Header photoCount={10} />);
    expect(screen.getByText("10 photos")).toBeInTheDocument();
  });

  it("should display singular form for one photo", () => {
    render(<Header photoCount={1} />);
    expect(screen.getByText("1 photo")).toBeInTheDocument();
  });

  it("should not display slideshow button when onStartSlideshow is not provided", () => {
    render(<Header photoCount={5} />);
    expect(screen.queryByRole("button", { name: /slideshow/i })).not.toBeInTheDocument();
  });

  it("should display slideshow button when onStartSlideshow is provided", () => {
    const mockOnStartSlideshow = vi.fn();
    render(<Header photoCount={5} onStartSlideshow={mockOnStartSlideshow} hasPhotos />);
    expect(screen.getByRole("button", { name: /slideshow/i })).toBeInTheDocument();
  });

  it("should call onStartSlideshow when slideshow button is clicked", () => {
    const mockOnStartSlideshow = vi.fn();
    render(<Header photoCount={5} onStartSlideshow={mockOnStartSlideshow} hasPhotos />);

    fireEvent.click(screen.getByRole("button", { name: /slideshow/i }));
    expect(mockOnStartSlideshow).toHaveBeenCalledTimes(1);
  });

  it("should disable slideshow button when hasPhotos is false", () => {
    const mockOnStartSlideshow = vi.fn();
    render(<Header photoCount={0} onStartSlideshow={mockOnStartSlideshow} hasPhotos={false} />);

    const button = screen.getByRole("button", { name: /slideshow/i });
    expect(button).toBeDisabled();
  });

  it("should enable slideshow button when hasPhotos is true", () => {
    const mockOnStartSlideshow = vi.fn();
    render(<Header photoCount={5} onStartSlideshow={mockOnStartSlideshow} hasPhotos />);

    const button = screen.getByRole("button", { name: /slideshow/i });
    expect(button).not.toBeDisabled();
  });
});
