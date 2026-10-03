import type { CSSProperties, ReactNode } from "react";

import classNames from "classnames/bind";

import type { CellStyle } from "@/features/spreadsheet/types";

import styles from "./Cell.module.scss";

const cx = classNames.bind(styles);

interface CellProps {
  children?: ReactNode;
  className?: string;

  style: CellStyle;

  selected?: boolean;
  editing?: boolean;

  onSelect?: () => void;
  onDoubleClick?: () => void;
}

export default function Cell({
  children,
  className,
  style,
  selected = false,
  editing = false,
  onSelect,
  onDoubleClick,
}: CellProps) {
  const cellStyle: CSSProperties = {
    backgroundColor: style.fillColor,

    textAlign: style.horizontalAlign,

    alignItems:
      style.verticalAlign === "top"
        ? "flex-start"
        : style.verticalAlign === "middle"
          ? "center"
          : "flex-end",

    whiteSpace: style.textWrapping === "wrap" ? "normal" : "nowrap",

    overflow: style.textWrapping === "clip" ? "hidden" : "visible",

    transform:
      style.textRotation === "angledown"
        ? "rotate(45deg)"
        : style.textRotation === "angleup"
          ? "rotate(-45deg)"
          : undefined,
  };

  return (
    <div
      className={cx(
        "cell",
        {
          selected,
          editing,
        },
        className,
      )}
      style={cellStyle}
      onMouseDown={onSelect}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
}
