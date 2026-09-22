import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import ToolbarButton from "../../base/ToolButton";

import type { GroupName } from "./useToolbarOverflow";

import styles from "./ToolbarOverflow.module.scss";

const cx = classNames.bind(styles);

const GAP = 8;
const VIEWPORT_PADDING = 8;

interface ToolbarOverflowProps {
  groups: GroupName[];
  renderGroup: (group: GroupName) => ReactNode;
}

export default function ToolbarOverflow({
  groups,
  renderGroup,
}: ToolbarOverflowProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    const dropdown = dropdownRef.current;

    if (!button || !dropdown) {
      return;
    }

    const buttonRect = button.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();

    let left = buttonRect.right - dropdownRect.width;
    let top = buttonRect.bottom + GAP;

    left = Math.max(left, VIEWPORT_PADDING);

    left = Math.min(
      left,
      window.innerWidth - VIEWPORT_PADDING - dropdownRect.width,
    );

    if (top + dropdownRect.height > window.innerHeight - VIEWPORT_PADDING) {
      top = buttonRect.top - dropdownRect.height - GAP;
    }

    top = Math.max(top, VIEWPORT_PADDING);

    dropdown.style.left = `${left}px`;
    dropdown.style.top = `${top}px`;
    dropdown.style.visibility = "visible";
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    const frame = requestAnimationFrame(() => {
      updatePosition();
    });

    const dropdown = dropdownRef.current;

    const observer = dropdown ? new ResizeObserver(updatePosition) : null;

    if (dropdown && observer) {
      observer.observe(dropdown);
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      cancelAnimationFrame(frame);

      observer?.disconnect();

      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  if (groups.length === 0) {
    return null;
  }

  return (
    <>
      <div ref={buttonRef} className={cx("more")}>
        <ToolbarButton
          onClick={toggle}
          open={open}
          aria-label="More"
          aria-expanded={open}
        >
          <Icon icon="bi:three-dots-vertical" />
        </ToolbarButton>
      </div>

      {open && (
        <div ref={dropdownRef} className={cx("overflow")}>
          {groups.map((group, index) => (
            <Fragment key={group}>
              <div className={cx("group")}>{renderGroup(group)}</div>

              {index < groups.length - 1 && (
                <span className={cx("divider")} aria-hidden="true" />
              )}
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}
