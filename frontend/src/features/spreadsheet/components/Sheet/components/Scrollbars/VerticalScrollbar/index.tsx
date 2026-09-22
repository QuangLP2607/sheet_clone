import { forwardRef } from "react";

import type { UIEvent } from "react";
import classNames from "classnames/bind";

import styles from "./VerticalScrollbar.module.scss";

const cx = classNames.bind(styles);

interface VerticalScrollbarProps {
  totalHeight: number;
  className?: string;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
}

const VerticalScrollbar = forwardRef<HTMLDivElement, VerticalScrollbarProps>(
  function VerticalScrollbar({ totalHeight, className, onScroll }, ref) {
    return (
      <div ref={ref} className={cx("scrollbar", className)} onScroll={onScroll}>
        <div
          style={{
            width: 1,
            height: totalHeight,
          }}
        />
      </div>
    );
  },
);

export default VerticalScrollbar;
