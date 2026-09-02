import type { ReactNode } from "react";
import classNames from "classnames/bind";

import styles from "./tool-group.module.scss";

const cx = classNames.bind(styles);

interface ToolGroupProps {
  children: ReactNode;
  className?: string;
}

export default function ToolGroup({ children, className }: ToolGroupProps) {
  return <div className={cx("tool__group", className)}>{children}</div>;
}
