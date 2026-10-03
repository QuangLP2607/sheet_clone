import { useLayoutEffect, useRef } from "react";

import type { CellData } from "@/features/spreadsheet/types";

import CellValue from "../CellContainer/CellValue";

interface MeasureCellProps {
  cell: CellData;
  width: number;
  onMeasure: (height: number) => void;
}

export default function MeasureCell({
  cell,
  width,
  onMeasure,
}: MeasureCellProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    onMeasure(element.scrollHeight);
  }, [cell, width, onMeasure]);

  const isWrapping = cell.style.textWrapping === "wrap";

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,

        visibility: "hidden",
        pointerEvents: "none",

        width,
        boxSizing: "border-box",

        whiteSpace: isWrapping ? "normal" : "nowrap",

        fontFamily: cell.textStyle.fontFamily,
        fontSize: `${cell.textStyle.fontSize}px`,
        fontWeight: cell.textStyle.bold ? "bold" : "normal",
        fontStyle: cell.textStyle.italic ? "italic" : "normal",
        textDecoration: cell.textStyle.strike ? "line-through" : "none",

        textAlign: cell.textStyle.textAlign,
      }}
    >
      <CellValue content={cell.content} />
    </div>
  );
}
