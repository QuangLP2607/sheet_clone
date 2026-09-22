import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import Dropdown from "@/components/Dropdown";

import styles from "./Zoom.module.scss";

const cx = classNames.bind(styles);

const ZOOM_LEVELS = [50, 75, 80, 90, 100, 110, 125, 150, 175, 200] as const;

const MIN_ZOOM = 25;
const MAX_ZOOM = 400;

interface ZoomProps {
  value: number;
  onChange: (zoom: number) => void;
}

const clampZoom = (zoom: number) =>
  Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);

export default function Zoom({ value, onChange }: ZoomProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string | null>(null);

  const displayValue = inputValue ?? String(value);

  const commitZoom = (input: string | number) => {
    const zoom = Number(input);

    if (!Number.isFinite(zoom)) {
      setInputValue(null);
      return;
    }

    onChange(clampZoom(zoom));
    setInputValue(null);
  };

  const focusInput = () => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    setInputValue(String(value));

    input.focus();
    input.select();
  };

  const handleControlClick = (toggle: () => void) => {
    focusInput();
    toggle();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    close: () => void,
  ) => {
    if (event.key === "Escape") {
      setInputValue(null);
      event.currentTarget.blur();
      close();
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    commitZoom(inputValue ?? String(value));

    event.currentTarget.blur();
    close();
  };

  const handleInputBlur = () => {
    if (inputValue === null) {
      return;
    }

    commitZoom(inputValue);
  };

  const handleZoomSelect = (zoom: number, close: () => void) => {
    onChange(zoom);
    setInputValue(null);
    close();
  };

  return (
    <Dropdown
      align="center"
      trigger={({ open, toggle, close }) => (
        <div className={cx("zoom")}>
          <div
            className={cx("zoom__control")}
            onClick={() => handleControlClick(toggle)}
          >
            <input
              ref={inputRef}
              type="number"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              value={displayValue}
              className={cx("zoom__input")}
              aria-label="Zoom"
              onChange={handleInputChange}
              onKeyDown={(event) => handleInputKeyDown(event, close)}
              onBlur={handleInputBlur}
            />

            <span className={cx("zoom__percent")}>%</span>

            <Icon
              icon="material-symbols:arrow-drop-down-rounded"
              className={cx("zoom__arrow", {
                "zoom__arrow--open": open,
              })}
            />
          </div>
        </div>
      )}
    >
      {({ close }) => (
        <div className={cx("zoom__popover")}>
          {ZOOM_LEVELS.map((zoom) => (
            <button
              key={zoom}
              type="button"
              className={cx("zoom__option", {
                "zoom__option--active": value === zoom,
              })}
              onClick={() => handleZoomSelect(zoom, close)}
            >
              {zoom}%
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
