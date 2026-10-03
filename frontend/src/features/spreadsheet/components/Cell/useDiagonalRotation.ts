import {
  useCallback,
  useLayoutEffect,
  useState,
  type CSSProperties,
} from "react";

import type { CellStyle } from "@/features/spreadsheet/types";

interface RotationSize {
  width: number;
  height: number;
}

const ANGLES = {
  angledown: 45,
  angleup: -45,
} as const;

type DiagonalRotationType = keyof typeof ANGLES;

function isDiagonalRotation(
  rotation: CellStyle["textRotation"],
): rotation is DiagonalRotationType {
  return rotation === "angledown" || rotation === "angleup";
}

function getRotatedSize(
  width: number,
  height: number,
  angle: number,
): RotationSize {
  const radians = (Math.abs(angle) * Math.PI) / 180;

  return {
    width:
      Math.abs(width * Math.cos(radians)) +
      Math.abs(height * Math.sin(radians)),

    height:
      Math.abs(width * Math.sin(radians)) +
      Math.abs(height * Math.cos(radians)),
  };
}

export function useDiagonalRotation(rotation: CellStyle["textRotation"]) {
  const [content, setContent] = useState<HTMLSpanElement | null>(null);

  const [size, setSize] = useState<RotationSize>({
    width: 0,
    height: 0,
  });

  const contentRef = useCallback((element: HTMLSpanElement | null) => {
    setContent(element);
  }, []);

  useLayoutEffect(() => {
    if (!content || !isDiagonalRotation(rotation)) {
      return;
    }

    const updateSize = () => {
      const width = content.offsetWidth;
      const height = content.offsetHeight;

      if (!width || !height) {
        return;
      }

      const angle = ANGLES[rotation];

      setSize(getRotatedSize(width, height, angle));
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);

    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, [content, rotation]);

  const isDiagonal = isDiagonalRotation(rotation);

  const angle = isDiagonal ? ANGLES[rotation] : 0;

  const contentStyle: CSSProperties = isDiagonal
    ? {
        transform: `
          translate(-50%, -50%)
          rotate(${angle}deg)
        `,
        transformOrigin: "center center",
      }
    : {};

  return {
    contentRef,
    width: isDiagonal ? size.width : 0,
    height: isDiagonal ? size.height : 0,
    contentStyle,
  };
}
