import type { ReactNode } from "react";

import classNames from "classnames/bind";

import type { CellStyle } from "@/types/cell-style";

import styles from "./Cell.module.scss";

const cx = classNames.bind(styles);

interface CellProps {
  style: CellStyle;
  selected: boolean;
  editing: boolean;
  children?: ReactNode;
  className?: string;
  onSelect: () => void;
  onDoubleClick: () => void;
}

export default function Cell({
  style,
  selected,
  editing,
  children,
  className,
  onSelect,
  onDoubleClick,
}: CellProps) {
  const isWrapping = style.textWrapping === "wrap";

  const whiteSpace = isWrapping ? "normal" : "nowrap";

  const overflow = style.textWrapping === "clip" ? "hidden" : "visible";

  const overflowWrap = isWrapping ? "break-word" : "normal";

  const wordBreak = isWrapping ? "break-word" : "normal";

  return (
    <div
      data-cell
      className={cx(
        "cell",
        {
          "cell--selected": selected,
          "cell--editing": editing,
        },
        className,
      )}
      onMouseDown={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onDoubleClick();
      }}
      style={{
        backgroundColor: style.fillColor || undefined,

        fontFamily: style.fontFamily || undefined,

        fontSize: `${style.fontSize}px`,

        fontWeight: style.bold ? "bold" : undefined,

        fontStyle: style.italic ? "italic" : undefined,

        textDecoration: style.strike ? "line-through" : undefined,

        color: style.color || undefined,

        alignItems:
          style.verticalAlign === "top"
            ? "flex-start"
            : style.verticalAlign === "bottom"
              ? "flex-end"
              : "center",

        justifyContent:
          style.horizontalAlign === "left"
            ? "flex-start"
            : style.horizontalAlign === "right"
              ? "flex-end"
              : "center",

        whiteSpace,
        overflow,
        overflowWrap,
        wordBreak,
      }}
    >
      {children}
    </div>
  );
}
