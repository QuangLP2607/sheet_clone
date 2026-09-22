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

  const frameRef = useRef<number | null>(null);

  /*
   * Scroll range
   */

  const getMaxScrollLeft = useCallback(() => {
    const element = horizontalScrollbarRef.current;

    if (!element) {
      return 0;
    }

    return Math.max(0, element.scrollWidth - element.clientWidth);
  }, [horizontalScrollbarRef]);

  const getMaxScrollTop = useCallback(() => {
    const element = verticalScrollbarRef.current;

    if (!element) {
      return 0;
    }

    return Math.max(0, element.scrollHeight - element.clientHeight);
  }, [verticalScrollbarRef]);

  /*
   * Clamp
   */

  const clampScrollLeft = useCallback(
    (value: number) => {
      return Math.min(getMaxScrollLeft(), Math.max(0, value));
    },
    [getMaxScrollLeft],
  );

  const clampScrollTop = useCallback(
    (value: number) => {
      return Math.min(getMaxScrollTop(), Math.max(0, value));
    },
    [getMaxScrollTop],
  );

  /*
   * Đồng bộ grid.
   *
   * Không cập nhật lại scrollbar ở đây.
   *
   * Scrollbar là nơi phát sinh scroll event
   * thì không nên tự set lại chính nó.
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

  /*
   * Đồng bộ scrollbar.
   *
   * Dùng khi scroll đến từ wheel / touch,
   * vì lúc đó scrollbar chưa tự thay đổi.
   */
  const syncScrollbars = useCallback(
    (left: number, top: number) => {
      if (horizontalScrollbarRef.current) {
        horizontalScrollbarRef.current.scrollLeft = left;
      }

      if (verticalScrollbarRef.current) {
        verticalScrollbarRef.current.scrollTop = top;
      }
    },
    [horizontalScrollbarRef, verticalScrollbarRef],
  );

  /*
   * Set vị trí scroll trực tiếp.
   */
  const setScrollPosition = useCallback(
    (left: number, top: number) => {
      const nextLeft = clampScrollLeft(left);
      const nextTop = clampScrollTop(top);

      scrollPos.current = {
        left: nextLeft,
        top: nextTop,
      };

      syncSheetPosition(nextLeft, nextTop);
    },
    [clampScrollLeft, clampScrollTop, syncSheetPosition],
  );

  /*
   * Apply pending wheel/touch delta.
   *
   * Chỉ chạy tối đa một lần mỗi animation frame.
   */
  const flushScroll = useCallback(() => {
    frameRef.current = null;

    const { x, y } = pendingDelta.current;

    pendingDelta.current = {
      x: 0,
      y: 0,
    };

    if (x === 0 && y === 0) {
      return;
    }

    const nextLeft = clampScrollLeft(scrollPos.current.left + x);

    const nextTop = clampScrollTop(scrollPos.current.top + y);

    scrollPos.current = {
      left: nextLeft,
      top: nextTop,
    };

    syncSheetPosition(nextLeft, nextTop);

    syncScrollbars(nextLeft, nextTop);
  }, [clampScrollLeft, clampScrollTop, syncSheetPosition, syncScrollbars]);

  /*
   * Di chuyển sheet theo delta.
   *
   * Wheel / touch có thể phát rất nhiều event liên tục.
   * Gom chúng lại và xử lý tối đa một lần / frame.
   */
  const scrollBy = useCallback(
    (deltaX: number, deltaY: number) => {
      pendingDelta.current.x += deltaX;
      pendingDelta.current.y += deltaY;

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = requestAnimationFrame(flushScroll);
    },
    [flushScroll],
  );

  /*
   * Horizontal scrollbar
   *
   * Scrollbar là nguồn phát sinh scroll.
   * Không set lại horizontalScrollbar ở đây.
   */
  const handleHorizontalScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const left = event.currentTarget.scrollLeft;

      scrollPos.current.left = left;

      syncSheetPosition(left, scrollPos.current.top);
    },
    [syncSheetPosition],
  );

  /*
   * Vertical scrollbar
   */
  const handleVerticalScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const top = event.currentTarget.scrollTop;

      scrollPos.current.top = top;

      syncSheetPosition(scrollPos.current.left, top);
    },
    [syncSheetPosition],
  );

  /*
   * Wheel
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

  /*
   * Cleanup requestAnimationFrame.
   */
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
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
