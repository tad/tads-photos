import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useKeyboardNavigation } from "../useKeyboardNavigation";

describe("useKeyboardNavigation", () => {
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnTogglePlay = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const simulateKeyDown = (key: string) => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true });
    window.dispatchEvent(event);
  };

  it("should call onNext when ArrowRight is pressed", () => {
    renderHook(() =>
      useKeyboardNavigation({
        isActive: true,
        onNext: mockOnNext,
        onPrevious: mockOnPrevious,
        onClose: mockOnClose,
      })
    );

    simulateKeyDown("ArrowRight");
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it("should call onPrevious when ArrowLeft is pressed", () => {
    renderHook(() =>
      useKeyboardNavigation({
        isActive: true,
        onNext: mockOnNext,
        onPrevious: mockOnPrevious,
        onClose: mockOnClose,
      })
    );

    simulateKeyDown("ArrowLeft");
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when Escape is pressed", () => {
    renderHook(() =>
      useKeyboardNavigation({
        isActive: true,
        onNext: mockOnNext,
        onPrevious: mockOnPrevious,
        onClose: mockOnClose,
      })
    );

    simulateKeyDown("Escape");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onTogglePlay when Space is pressed", () => {
    renderHook(() =>
      useKeyboardNavigation({
        isActive: true,
        onNext: mockOnNext,
        onPrevious: mockOnPrevious,
        onClose: mockOnClose,
        onTogglePlay: mockOnTogglePlay,
      })
    );

    simulateKeyDown(" ");
    expect(mockOnTogglePlay).toHaveBeenCalledTimes(1);
  });

  it("should not call any handlers when isActive is false", () => {
    renderHook(() =>
      useKeyboardNavigation({
        isActive: false,
        onNext: mockOnNext,
        onPrevious: mockOnPrevious,
        onClose: mockOnClose,
        onTogglePlay: mockOnTogglePlay,
      })
    );

    simulateKeyDown("ArrowRight");
    simulateKeyDown("ArrowLeft");
    simulateKeyDown("Escape");
    simulateKeyDown(" ");

    expect(mockOnNext).not.toHaveBeenCalled();
    expect(mockOnPrevious).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnTogglePlay).not.toHaveBeenCalled();
  });

  it("should not throw when onTogglePlay is not provided and Space is pressed", () => {
    renderHook(() =>
      useKeyboardNavigation({
        isActive: true,
        onNext: mockOnNext,
        onPrevious: mockOnPrevious,
        onClose: mockOnClose,
      })
    );

    expect(() => simulateKeyDown(" ")).not.toThrow();
  });

  it("should remove event listener when isActive becomes false", () => {
    const { rerender } = renderHook(
      ({ isActive }) =>
        useKeyboardNavigation({
          isActive,
          onNext: mockOnNext,
          onPrevious: mockOnPrevious,
          onClose: mockOnClose,
        }),
      { initialProps: { isActive: true } }
    );

    simulateKeyDown("ArrowRight");
    expect(mockOnNext).toHaveBeenCalledTimes(1);

    rerender({ isActive: false });

    simulateKeyDown("ArrowRight");
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});
