import type { ReactNode } from "react";

import classNames from "classnames/bind";

import styles from "./tool-group.module.scss";

const cx = classNames.bind(styles);

export type ToolGroupMode = "toolbar" | "overflow";

interface ToolGroupProps {
  children: ReactNode;
  className?: string;
  mode?: ToolGroupMode;
}

export default function ToolGroup({
  children,
  className,
  mode = "toolbar",
}: ToolGroupProps) {
  return (
    <div
      className={cx(
        "tool__group",
        {
          "tool__group--overflow": mode === "overflow",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
