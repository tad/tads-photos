import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRandomOrder } from "../useRandomOrder";

describe("useRandomOrder", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return sequential next index when disabled", () => {
    const { result } = renderHook(() =>
      useRandomOrder({ totalPhotos: 5, currentIndex: 2, enabled: false })
    );

    expect(result.current.getNextIndex()).toBe(3);
  });

  it("should wrap around to 0 when at last index and disabled", () => {
    const { result } = renderHook(() =>
      useRandomOrder({ totalPhotos: 5, currentIndex: 4, enabled: false })
    );

    expect(result.current.getNextIndex()).toBe(0);
  });

  it("should return random index when enabled", () => {
    vi.mocked(Math.random).mockReturnValue(0.5);

    const { result } = renderHook(() =>
      useRandomOrder({ totalPhotos: 5, currentIndex: 0, enabled: true })
    );

    const nextIndex = result.current.getNextIndex();
    // With 4 unshown indices (1,2,3,4), 0.5 * 4 = 2, so we should get index 3
    expect(nextIndex).toBe(3);
  });

  it("should not repeat photos until all are shown", () => {
    vi.mocked(Math.random).mockReturnValue(0); // Always pick first available

    const shownPhotos = new Set<number>();
    let currentIdx = 0;

    const { result, rerender } = renderHook(
      ({ currentIndex }) =>
        useRandomOrder({ totalPhotos: 5, currentIndex, enabled: true }),
      { initialProps: { currentIndex: 0 } }
    );

    // Simulate showing all 5 photos
    for (let i = 0; i < 5; i++) {
      shownPhotos.add(currentIdx);
      const nextIndex = result.current.getNextIndex();
      currentIdx = nextIndex;
      rerender({ currentIndex: currentIdx });
    }

    // All 5 photos should have been shown
    expect(shownPhotos.size).toBe(5);
  });

  it("should reset shown photos after all have been displayed", () => {
    vi.mocked(Math.random).mockReturnValue(0); // Always pick first available

    const { result, rerender } = renderHook(
      ({ currentIndex }) =>
        useRandomOrder({ totalPhotos: 3, currentIndex, enabled: true }),
      { initialProps: { currentIndex: 0 } }
    );

    // First call: current is 0, unshown are [1, 2], picks 1
    let next = result.current.getNextIndex();
    expect(next).toBe(1);

    // Simulate moving to index 1
    rerender({ currentIndex: 1 });

    // Second call: current is 1, shown is {0, 1}, unshown is [2], picks 2
    next = result.current.getNextIndex();
    expect(next).toBe(2);

    // Simulate moving to index 2
    rerender({ currentIndex: 2 });

    // Third call: current is 2, shown is {0, 1, 2}, all shown!
    // Should reset and pick from [0, 1] (excluding current 2)
    next = result.current.getNextIndex();
    expect(next).toBe(0); // First of [0, 1]
  });

  it("should reset shown set when reset is called", () => {
    vi.mocked(Math.random).mockReturnValue(0);

    const { result, rerender } = renderHook(
      ({ currentIndex }) =>
        useRandomOrder({ totalPhotos: 3, currentIndex, enabled: true }),
      { initialProps: { currentIndex: 0 } }
    );

    // Show first photo
    result.current.getNextIndex();
    rerender({ currentIndex: 1 });
    result.current.getNextIndex();

    // Reset the shown set
    act(() => {
      result.current.reset();
    });

    rerender({ currentIndex: 0 });

    // After reset, should start fresh - unshown should be [1, 2]
    const next = result.current.getNextIndex();
    expect(next).toBe(1);
  });

  it("should handle single photo edge case", () => {
    vi.mocked(Math.random).mockReturnValue(0);

    const { result } = renderHook(() =>
      useRandomOrder({ totalPhotos: 1, currentIndex: 0, enabled: true })
    );

    // With only 1 photo, it should return 0 (wrap around behavior)
    const next = result.current.getNextIndex();
    expect(next).toBe(0);
  });

  it("should handle two photos edge case", () => {
    vi.mocked(Math.random).mockReturnValue(0);

    const { result, rerender } = renderHook(
      ({ currentIndex }) =>
        useRandomOrder({ totalPhotos: 2, currentIndex, enabled: true }),
      { initialProps: { currentIndex: 0 } }
    );

    // Current is 0, unshown is [1], should return 1
    let next = result.current.getNextIndex();
    expect(next).toBe(1);

    rerender({ currentIndex: 1 });

    // Current is 1, shown is {0, 1}, all shown, reset picks from [0]
    next = result.current.getNextIndex();
    expect(next).toBe(0);
  });
});
