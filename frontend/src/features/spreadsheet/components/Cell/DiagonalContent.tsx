import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import type { CellStyle } from "@/features/spreadsheet/types";

import styles from "./Cell.module.scss";

type DiagonalRotation = Extract<
  CellStyle["textRotation"],
  "angledown" | "angleup"
>;

interface DiagonalContentProps {
  rotation: DiagonalRotation;
  children?: ReactNode;
}

interface Size {
  width: number;
  height: number;
}

const ANGLES: Record<DiagonalRotation, number> = {
  angledown: 45,
  angleup: -45,
};

function getRotatedSize(width: number, height: number, angle: number): Size {
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

export default function DiagonalContent({
  rotation,
  children,
}: DiagonalContentProps) {
  const contentRef = useRef<HTMLSpanElement>(null);

  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const content = contentRef.current;

    if (!content) {
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

    const observer = new ResizeObserver(updateSize);

    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, [rotation]);

  const angle = ANGLES[rotation];

  const contentStyle: CSSProperties = {
    transform: `
      translate(-50%, -50%)
      rotate(${angle}deg)
    `,
    transformOrigin: "center center",
  };

  return (
    <span
      className={styles["cell__rotation-box"]}
      style={{
        width: size.width || undefined,
        height: size.height || undefined,
      }}
    >
      <span
        ref={contentRef}
        className={styles["cell__rotation-content"]}
        style={contentStyle}
      >
        {children}
      </span>
    </span>
  );
}
