import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";

import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import Dropdown from "@/components/Dropdown";

import { getContrastColor } from "./utils/colorContrast";
import COLOR_PALETTE from "./constants/colors";
import { useEyeDropper } from "./hooks/useEyeDropper";
import CustomColorModal from "./components/CustomColorModal";

import styles from "./colorPicker.module.scss";

const cx = classNames.bind(styles);

const MAX_RECENT_COLORS = 8;

interface ColorPickerProps {
  value?: string | null;
  resetColor?: string | null;
  onChange?: (color: string | null) => void;
  children?: ReactNode | ((props: { open: boolean }) => ReactNode);
}

interface ColorButtonProps {
  color: string;
  active: boolean;
  onClick: () => void;
}

const preventEditorBlur = (event: MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

function ColorButton({ color, active, onClick }: ColorButtonProps) {
  return (
    <button
      type="button"
      className={cx("color-picker__color", {
        "color-picker__color--active": active,
      })}
      style={{
        backgroundColor: color,
      }}
      aria-label={`Choose ${color}`}
      onMouseDown={preventEditorBlur}
      onClick={onClick}
    >
      {active && (
        <Icon
          icon="mdi:check"
          className={cx("color-picker__check")}
          style={{
            color: getContrastColor(color),
          }}
        />
      )}
    </button>
  );
}

export default function ColorPicker({
  value,
  resetColor = null,
  onChange,
  children,
}: ColorPickerProps) {
  const { pickColor } = useEyeDropper();

  const [showCustomColor, setShowCustomColor] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const addRecentColor = (color: string) => {
    setRecentColors((prev) =>
      [color, ...prev.filter((item) => item !== color)].slice(
        0,
        MAX_RECENT_COLORS,
      ),
    );
  };

  const selectColor = (color: string | null, close: () => void) => {
    onChange?.(color);
    setShowCustomColor(false);
    close();
  };

  const selectCustomColor = (color: string, close: () => void) => {
    addRecentColor(color);
    selectColor(color, close);
  };

  const handlePickColor = async (close: () => void) => {
    try {
      const color = await pickColor();

      if (color) {
        selectCustomColor(color, close);
      }
    } catch {
      // User cancelled EyeDropper or browser does not support it.
    }
  };

  return (
    <Dropdown
      trigger={({ toggle, open }) => {
        if (typeof children === "function") {
          return (
            <div
              className={cx("color-picker__trigger")}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={toggle}
            >
              {children({ open })}
            </div>
          );
        }

        if (children) {
          return (
            <div
              className={cx("color-picker__trigger")}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={toggle}
            >
              {children}
            </div>
          );
        }

        return (
          <button
            type="button"
            className={cx("color-picker__trigger-button")}
            style={{
              backgroundColor: value ?? "transparent",
            }}
            aria-label="Choose color"
            onMouseDown={preventEditorBlur}
            onClick={toggle}
          >
            <Icon
              icon="mdi:format-color-fill"
              width={16}
              height={16}
              color={value ? getContrastColor(value) : undefined}
            />
          </button>
        );
      }}
    >
      {({ close }) => (
        <div className={cx("color-picker__popover")}>
          {/* Reset */}
          <button
            type="button"
            className={cx("color-picker__reset", {
              "color-picker__reset--active": value === resetColor,
            })}
            onMouseDown={preventEditorBlur}
            onClick={() => selectColor(resetColor, close)}
          >
            <Icon icon="fa7-solid:tint-slash" />
            <span>Reset</span>
          </button>

          {/* Preset Colors */}
          <div className={cx("color-picker__palette")}>
            {COLOR_PALETTE.map((color) => (
              <ColorButton
                key={color}
                color={color}
                active={value === color}
                onClick={() => selectColor(color, close)}
              />
            ))}
          </div>

          <div className={cx("color-picker__separator")} />

          {/* Custom Colors */}
          <div className={cx("color-picker__custom")}>
            <button
              type="button"
              className={cx("color-picker__custom-label")}
              onMouseDown={preventEditorBlur}
              onClick={() => setShowCustomColor(true)}
            >
              Custom
            </button>

            <div className={cx("color-picker__custom-palette")}>
              {/* Recent Colors */}
              {recentColors.map((color) => (
                <ColorButton
                  key={color}
                  color={color}
                  active={value === color}
                  onClick={() => selectColor(color, close)}
                />
              ))}

              {/* Custom Color */}
              <button
                type="button"
                className={cx("color-picker__action")}
                aria-label="Choose custom color"
                onMouseDown={preventEditorBlur}
                onClick={() => setShowCustomColor(true)}
              >
                <Icon
                  icon="gg:add"
                  className={cx("color-picker__action-icon")}
                />
              </button>

              {/* Eye Dropper */}
              <button
                type="button"
                className={cx("color-picker__action")}
                aria-label="Pick color from screen"
                onMouseDown={preventEditorBlur}
                onClick={() => handlePickColor(close)}
              >
                <Icon
                  icon="mingcute:color-picker-line"
                  className={cx("color-picker__action-icon")}
                />
              </button>
            </div>
          </div>

          {/* Custom Color Modal */}
          {showCustomColor && (
            <CustomColorModal
              value={value}
              onClose={() => setShowCustomColor(false)}
              onChange={(color) => selectCustomColor(color, close)}
            />
          )}
        </div>
      )}
    </Dropdown>
  );
}
