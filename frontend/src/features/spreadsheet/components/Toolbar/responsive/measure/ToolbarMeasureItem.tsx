import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

import classNames from "classnames/bind";

import type { GroupName } from "../overflow/useToolbarOverflow";

import styles from "./ToolbarMeasureItem.module.scss";

const cx = classNames.bind(styles);

interface ToolbarMeasureItemProps {
  group: GroupName;
  onResize: (group: GroupName, width: number) => void;
  children: ReactNode;
}

export default function ToolbarMeasureItem({
  group,
  onResize,
  children,
}: ToolbarMeasureItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const measure = () => {
      onResize(group, element.getBoundingClientRect().width);
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [group, onResize]);

  return (
    <div ref={ref} className={cx("measure-item")}>
      {children}
    </div>
  );
}
