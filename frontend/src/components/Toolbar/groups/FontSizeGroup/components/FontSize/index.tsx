import { useCallback, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import { useClickOutside } from "@/hooks/useClickOutside";

import styles from "./FontSize.module.scss";

const cx = classNames.bind(styles);

const FONT_SIZES = [6, 7, 8, 9, 10, 11, 12, 14, 18, 24, 36] as const;

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

interface FontSizeProps {
  value: number;
  onChange: (fontSize: number) => void;
}

const preventEditorBlur = (event: MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

export default function FontSize({ value, onChange }: FontSizeProps) {
  const [open, setOpen] = useState(false);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, []);

  const fontSizeRef = useClickOutside<HTMLDivElement>(closeDropdown);

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const size = Number(event.target.value);

    if (!Number.isFinite(size)) {
      return;
    }

    if (size < MIN_FONT_SIZE) {
      return;
    }

    onChange(Math.min(size, MAX_FONT_SIZE));
  };

  const handleSelect = (size: number) => {
    onChange(size);
    setOpen(false);
  };

  const handleDecrease = () => {
    const size = Math.max(MIN_FONT_SIZE, value - 1);

    if (size !== value) {
      onChange(size);
    }
  };

  const handleIncrease = () => {
    const size = Math.min(MAX_FONT_SIZE, value + 1);

    if (size !== value) {
      onChange(size);
    }
  };

  return (
    <div ref={fontSizeRef} className={cx("font-size")}>
      <div className={cx("font-size__control")}>
        <button
          type="button"
          className={cx("font-size__button")}
          aria-label="Decrease font size"
          disabled={value <= MIN_FONT_SIZE}
          onMouseDown={preventEditorBlur}
          onClick={handleDecrease}
        >
          <Icon icon="mdi:minus" />
        </button>

        <input
          type="number"
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          value={value}
          className={cx("font-size__input")}
          aria-label="Font size"
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
        />

        <button
          type="button"
          className={cx("font-size__button")}
          aria-label="Increase font size"
          disabled={value >= MAX_FONT_SIZE}
          onMouseDown={preventEditorBlur}
          onClick={handleIncrease}
        >
          <Icon icon="mdi:plus" />
        </button>
      </div>

      {open && (
        <div className={cx("font-size__popover")}>
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={cx("font-size__option", {
                "font-size__option--active": value === size,
              })}
              onMouseDown={preventEditorBlur}
              onClick={() => handleSelect(size)}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
