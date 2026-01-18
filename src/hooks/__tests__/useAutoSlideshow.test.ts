import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAutoSlideshow } from "../useAutoSlideshow";

describe("useAutoSlideshow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should start with isPlaying as false", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() =>
      useAutoSlideshow({ isActive: true, onAdvance })
    );

    expect(result.current.isPlaying).toBe(false);
  });

  it("should start playing when play is called", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() =>
      useAutoSlideshow({ isActive: true, onAdvance })
    );

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);
  });

  it("should stop playing when pause is called", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() =>
      useAutoSlideshow({ isActive: true, onAdvance })
    );

    act(() => {
      result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.pause();
    });
    expect(result.current.isPlaying).toBe(false);
  });

  it("should toggle playing state", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() =>
      useAutoSlideshow({ isActive: true, onAdvance })
    );

    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isPlaying).toBe(false);
  });

  it("should call onAdvance at the specified interval when playing", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() =>
      useAutoSlideshow({ isActive: true, interval: 1000, onAdvance })
    );

    act(() => {
      result.current.play();
    });

    expect(onAdvance).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onAdvance).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onAdvance).toHaveBeenCalledTimes(2);
  });

  it("should not call onAdvance when paused", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() =>
      useAutoSlideshow({ isActive: true, interval: 1000, onAdvance })
    );

    act(() => {
      result.current.play();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      result.current.pause();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("should stop playing when isActive becomes false", () => {
    const onAdvance = vi.fn();
    const { result, rerender } = renderHook(
      ({ isActive }) => useAutoSlideshow({ isActive, onAdvance }),
      { initialProps: { isActive: true } }
    );

    act(() => {
      result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);

    rerender({ isActive: false });

    expect(result.current.isPlaying).toBe(false);
  });

  it("should use default interval of 5000ms", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() =>
      useAutoSlideshow({ isActive: true, onAdvance })
    );

    act(() => {
      result.current.play();
    });

    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(onAdvance).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("should clean up interval on unmount", () => {
    const onAdvance = vi.fn();
    const { result, unmount } = renderHook(() =>
      useAutoSlideshow({ isActive: true, interval: 1000, onAdvance })
    );

    act(() => {
      result.current.play();
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onAdvance).not.toHaveBeenCalled();
  });
});
