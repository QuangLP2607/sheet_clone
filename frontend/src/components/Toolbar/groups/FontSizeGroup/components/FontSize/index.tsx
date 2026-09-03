import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import classNames from "classnames/bind";

import { Icon } from "@iconify/react";

import Dropdown from "@/components/Dropdown";

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
  const [inputValue, setInputValue] = useState(String(value));

  const applyFontSize = (size: number) => {
    const nextSize = Math.min(Math.max(size, MIN_FONT_SIZE), MAX_FONT_SIZE);

    setInputValue(String(nextSize));
    onChange(nextSize);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setInputValue(String(value));
      event.currentTarget.blur();
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    const size = Number(inputValue);

    if (!Number.isFinite(size)) {
      setInputValue(String(value));
      return;
    }

    applyFontSize(size);
    event.currentTarget.blur();
  };

  const handleDecrease = () => {
    if (value <= MIN_FONT_SIZE) {
      return;
    }

    applyFontSize(value - 1);
  };

  const handleIncrease = () => {
    if (value >= MAX_FONT_SIZE) {
      return;
    }

    applyFontSize(value + 1);
  };

  const handleSelect = (size: number, close: () => void) => {
    applyFontSize(size);
    close();
  };

  return (
    <Dropdown
      align="center"
      trigger={({ open, toggle }) => (
        <div className={cx("font-size")}>
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
              value={inputValue}
              className={cx("font-size__input")}
              aria-label="Font size"
              onFocus={() => {
                if (!open) {
                  toggle();
                }
              }}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
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
        </div>
      )}
    >
      {({ close }) => (
        <div className={cx("font-size__popover")}>
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={cx("font-size__option", {
                "font-size__option--active": value === size,
              })}
              onMouseDown={preventEditorBlur}
              onClick={() => handleSelect(size, close)}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
