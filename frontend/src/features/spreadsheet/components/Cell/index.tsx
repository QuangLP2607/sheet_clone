import type { CSSProperties, ReactNode } from "react";

import classNames from "classnames/bind";

import {
  DEFAULT_CELL_STYLE,
  type CellStyle,
} from "@/features/spreadsheet/types";

import styles from "./Cell.module.scss";

const cx = classNames.bind(styles);

interface CellProps {
  children?: ReactNode;
  className?: string;

  style?: Partial<CellStyle>;

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
  const cellStyle: CellStyle = {
    ...DEFAULT_CELL_STYLE,
    ...style,
  };

  const cssStyle: CSSProperties = {
    backgroundColor: cellStyle.fillColor,

    textAlign: cellStyle.horizontalAlign,

    alignItems:
      cellStyle.verticalAlign === "top"
        ? "flex-start"
        : cellStyle.verticalAlign === "middle"
          ? "center"
          : "flex-end",

    whiteSpace: cellStyle.textWrapping === "wrap" ? "normal" : "nowrap",

    overflow: cellStyle.textWrapping === "clip" ? "hidden" : "visible",

    transform:
      cellStyle.textRotation === "angledown"
        ? "rotate(45deg)"
        : cellStyle.textRotation === "angleup"
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
      style={cssStyle}
      onMouseDown={onSelect}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
}
