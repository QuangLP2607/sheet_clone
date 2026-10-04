import { useCallback, useEffect, useRef } from "react";

import type { RefObject, UIEvent, WheelEvent } from "react";

import { VariableSizeGrid as Grid } from "react-window";

interface UseSheetScrollParams {
  bodyGridRef: RefObject<Grid | null>;
  rowHeaderRef: RefObject<Grid | null>;
  columnHeaderRef: RefObject<Grid | null>;
  horizontalScrollbarRef: RefObject<HTMLDivElement | null>;
  verticalScrollbarRef: RefObject<HTMLDivElement | null>;
  onViewMove?: () => void;
}

interface ScrollPosition {
  left: number;
  top: number;
}

interface PendingDelta {
  x: number;
  y: number;
}

export function useSheetScroll({
  bodyGridRef,
  rowHeaderRef,
  columnHeaderRef,
  horizontalScrollbarRef,
  verticalScrollbarRef,
  onViewMove,
}: UseSheetScrollParams) {
  const scrollPos = useRef<ScrollPosition>({
    left: 0,
    top: 0,
  });

  /**
   * Vị trí cuối cùng đã được sync.
   *
   * Dùng để tránh phát onViewMove
   * khi vị trí không thực sự thay đổi.
   */
  const syncedPositionRef = useRef<ScrollPosition>({
    left: 0,
    top: 0,
  });

  const pendingDelta = useRef<PendingDelta>({
    x: 0,
    y: 0,
  });

  const wheelFrameRef = useRef<number | null>(null);

  const syncFrameRef = useRef<number | null>(null);

  /**
   * Sync vị trí scroll cho toàn bộ sheet.
   */
  const syncSheetPosition = useCallback(
    (left: number, top: number) => {
      const previous = syncedPositionRef.current;

      /**
       * Vị trí không thay đổi.
       */
      if (previous.left === left && previous.top === top) {
        return;
      }

      syncedPositionRef.current = {
        left,
        top,
      };

      bodyGridRef.current?.scrollTo({
        scrollLeft: left,
        scrollTop: top,
      });

      columnHeaderRef.current?.scrollTo({
        scrollLeft: left,
        scrollTop: 0,
      });

      rowHeaderRef.current?.scrollTo({
        scrollLeft: 0,
        scrollTop: top,
      });

      /**
       * Chỉ phát event khi viewport
       * thực sự di chuyển.
       */
      onViewMove?.();
    },
    [bodyGridRef, rowHeaderRef, columnHeaderRef, onViewMove],
  );

  /**
   * Schedule sync bằng requestAnimationFrame.
   *
   * Gom nhiều scrollbar events vào một frame.
   */
  const scheduleSync = useCallback(() => {
    if (syncFrameRef.current !== null) {
      return;
    }

    syncFrameRef.current = requestAnimationFrame(() => {
      syncFrameRef.current = null;

      syncSheetPosition(scrollPos.current.left, scrollPos.current.top);
    });
  }, [syncSheetPosition]);

  /**
   * Scroll ngang bằng scrollbar.
   */
  const handleHorizontalScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const left = event.currentTarget.scrollLeft;

      if (left === scrollPos.current.left) {
        return;
      }

      scrollPos.current.left = left;

      scheduleSync();
    },
    [scheduleSync],
  );

  /**
   * Scroll dọc bằng scrollbar.
   */
  const handleVerticalScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const top = event.currentTarget.scrollTop;

      if (top === scrollPos.current.top) {
        return;
      }

      scrollPos.current.top = top;

      scheduleSync();
    },
    [scheduleSync],
  );

  /**
   * Flush wheel delta.
   *
   * Nhiều wheel event trong cùng frame
   * được gom lại.
   */
  const flushWheel = useCallback(() => {
    wheelFrameRef.current = null;

    const { x, y } = pendingDelta.current;

    pendingDelta.current.x = 0;
    pendingDelta.current.y = 0;

    if (x === 0 && y === 0) {
      return;
    }

    const horizontalScrollbar = horizontalScrollbarRef.current;

    const verticalScrollbar = verticalScrollbarRef.current;

    let nextLeft = scrollPos.current.left;

    let nextTop = scrollPos.current.top;

    if (x !== 0 && horizontalScrollbar) {
      horizontalScrollbar.scrollLeft += x;

      nextLeft = horizontalScrollbar.scrollLeft;
    }

    if (y !== 0 && verticalScrollbar) {
      verticalScrollbar.scrollTop += y;

      nextTop = verticalScrollbar.scrollTop;
    }

    scrollPos.current.left = nextLeft;

    scrollPos.current.top = nextTop;

    syncSheetPosition(nextLeft, nextTop);
  }, [horizontalScrollbarRef, verticalScrollbarRef, syncSheetPosition]);

  /**
   * Scroll theo delta.
   */
  const scrollBy = useCallback(
    (deltaX: number, deltaY: number) => {
      pendingDelta.current.x += deltaX;

      pendingDelta.current.y += deltaY;

      if (wheelFrameRef.current !== null) {
        return;
      }

      wheelFrameRef.current = requestAnimationFrame(flushWheel);
    },
    [flushWheel],
  );

  /**
   * Xử lý wheel.
   */
  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (event.shiftKey || event.deltaX !== 0) {
        const deltaX = event.deltaX !== 0 ? event.deltaX : event.deltaY;

        scrollBy(deltaX, 0);

        return;
      }

      scrollBy(0, event.deltaY);
    },
    [scrollBy],
  );

  /**
   * Set vị trí scroll từ bên ngoài.
   */
  const setScrollPosition = useCallback(
    (left: number, top: number) => {
      const horizontalScrollbar = horizontalScrollbarRef.current;

      const verticalScrollbar = verticalScrollbarRef.current;

      const maxScrollLeft = horizontalScrollbar
        ? Math.max(
            0,
            horizontalScrollbar.scrollWidth - horizontalScrollbar.clientWidth,
          )
        : 0;

      const maxScrollTop = verticalScrollbar
        ? Math.max(
            0,
            verticalScrollbar.scrollHeight - verticalScrollbar.clientHeight,
          )
        : 0;

      const nextLeft = Math.min(maxScrollLeft, Math.max(0, left));

      const nextTop = Math.min(maxScrollTop, Math.max(0, top));

      if (horizontalScrollbar) {
        horizontalScrollbar.scrollLeft = nextLeft;
      }

      if (verticalScrollbar) {
        verticalScrollbar.scrollTop = nextTop;
      }

      scrollPos.current.left = nextLeft;

      scrollPos.current.top = nextTop;

      syncSheetPosition(nextLeft, nextTop);
    },
    [horizontalScrollbarRef, verticalScrollbarRef, syncSheetPosition],
  );

  /**
   * Cleanup animation frames.
   */
  useEffect(() => {
    return () => {
      if (wheelFrameRef.current !== null) {
        cancelAnimationFrame(wheelFrameRef.current);
      }

      if (syncFrameRef.current !== null) {
        cancelAnimationFrame(syncFrameRef.current);
      }
    };
  }, []);

  return {
    handleHorizontalScroll,
    handleVerticalScroll,
    handleWheel,
    scrollBy,
    setScrollPosition,
  };
}
