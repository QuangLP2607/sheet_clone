import { forwardRef, type ButtonHTMLAttributes } from "react";
import classNames from "classnames/bind";

import styles from "./tool-button.module.scss";

const cx = classNames.bind(styles);

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  open?: boolean;
}

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(
    {
      active = false,
      open = false,
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
            "tool__btn--open": open,
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
        {props.children}
      </button>
    );
  },
);

export default ToolbarButton;
