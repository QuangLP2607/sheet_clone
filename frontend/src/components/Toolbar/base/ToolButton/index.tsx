import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import classNames from "classnames/bind";

import styles from "./tool-button.module.scss";

const cx = classNames.bind(styles);

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  wide?: boolean;
  children?: ReactNode;
}

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(
    {
      active = false,
      wide = false,
      children,
      className,
      type = "button",
      onMouseDown,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cx(
          "tool__btn",
          {
            "tool__btn--active": active,
            "tool__btn--wide": wide,
          },
          className,
        )}
        type={type}
        {...props}
        onMouseDown={(event) => {
          event.preventDefault();
          onMouseDown?.(event);
        }}
      >
        {children}
      </button>
    );
  },
);

export default ToolbarButton;
