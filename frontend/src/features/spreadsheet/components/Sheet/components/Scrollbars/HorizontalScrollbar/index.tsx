import { forwardRef } from "react";
import type { UIEvent } from "react";

import classNames from "classnames/bind";

import styles from "./HorizontalScrollbar.module.scss";

const cx = classNames.bind(styles);

interface HorizontalScrollbarProps {
  totalWidth: number;
  className?: string;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
}

const HorizontalScrollbar = forwardRef<
  HTMLDivElement,
  HorizontalScrollbarProps
>(function HorizontalScrollbar({ totalWidth, className, onScroll }, ref) {
  return (
    <div ref={ref} className={cx("scrollbar", className)} onScroll={onScroll}>
      <div
        className={cx("content")}
        style={{
          width: totalWidth,
        }}
      />
    </div>
  );
});

export default HorizontalScrollbar;
