import { useCallback, useEffect, useRef } from "react";

import type { RefObject, UIEvent, WheelEvent } from "react";

import { VariableSizeGrid as Grid } from "react-window";

interface UseSheetScrollParams {
  bodyGridRef: RefObject<Grid | null>;
  rowHeaderRef: RefObject<Grid | null>;
  columnHeaderRef: RefObject<Grid | null>;

  horizontalScrollbarRef: RefObject<HTMLDivElement | null>;
  verticalScrollbarRef: RefObject<HTMLDivElement | null>;
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
}: UseSheetScrollParams) {
  const scrollPos = useRef<ScrollPosition>({
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
   * Sync react-window grids with the current native scroll position.
   */
  const syncSheetPosition = useCallback(
    (left: number, top: number) => {
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
    },
    [bodyGridRef, rowHeaderRef, columnHeaderRef],
  );

  /**
   * Schedule synchronization for native scrollbar events.
   *
   * Used when the user directly interacts with
   * the native scrollbar.
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
   * Native horizontal scrollbar.
   *
   * This is the source of truth when the user
   * directly interacts with the scrollbar.
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
   * Native vertical scrollbar.
   *
   * This is the source of truth when the user
   * directly interacts with the scrollbar.
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
   * Flush wheel movement.
   *
   * Important:
   *
   * Wheel scrolling uses ONE RAF.
   *
   * We calculate the next native scrollbar position
   * and sync react-window in the same frame.
   *
   * We do not wait for the native scrollbar's
   * scroll event to trigger another RAF.
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
   * Accumulate wheel movement and process it
   * once per animation frame.
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
   * Wheel on the sheet.
   *
   * The sheet itself does not scroll.
   * Instead, it drives the native scrollbar.
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
   * Set an absolute scroll position.
   *
   * Used for programmatic scrolling such as:
   * - keyboard navigation
   * - jumping to a cell
   * - restoring scroll position
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
