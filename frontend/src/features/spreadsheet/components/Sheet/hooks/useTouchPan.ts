import { useEffect, useRef } from "react";

import type { RefObject } from "react";

interface UseTouchPanParams {
  targetRef: RefObject<HTMLElement | null>;
  scrollBy: (deltaX: number, deltaY: number) => void;
}

interface Point {
  x: number;
  y: number;
}

export function useTouchPan({ targetRef, scrollBy }: UseTouchPanParams) {
  const lastCenterRef = useRef<Point | null>(null);

  useEffect(() => {
    const element = targetRef.current;

    if (!element) {
      return;
    }

    const getCenter = (touches: TouchList): Point | null => {
      if (touches.length < 2) {
        return null;
      }

      const first = touches[0];
      const second = touches[1];

      return {
        x: (first.clientX + second.clientX) / 2,
        y: (first.clientY + second.clientY) / 2,
      };
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length < 2) {
        return;
      }

      lastCenterRef.current = getCenter(event.touches);

      event.preventDefault();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length < 2) {
        return;
      }

      const currentCenter = getCenter(event.touches);

      if (!currentCenter) {
        return;
      }

      const previousCenter = lastCenterRef.current;

      if (!previousCenter) {
        lastCenterRef.current = currentCenter;
        event.preventDefault();

        return;
      }

      const deltaX = currentCenter.x - previousCenter.x;
      const deltaY = currentCenter.y - previousCenter.y;

      lastCenterRef.current = currentCenter;

      scrollBy(-deltaX, -deltaY);

      event.preventDefault();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) {
        lastCenterRef.current = null;
      }
    };

    const handleTouchCancel = () => {
      lastCenterRef.current = null;
    };

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    element.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    element.addEventListener("touchend", handleTouchEnd);

    element.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [targetRef, scrollBy]);
}
