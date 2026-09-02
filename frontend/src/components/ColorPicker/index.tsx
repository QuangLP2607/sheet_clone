import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import { getContrastColor } from "./utils/colorContrast";
import COLOR_PALETTE from "./constants/colors";
import { useEyeDropper } from "./hooks/useEyeDropper";
import CustomColorModal from "./components/CustomColorModal";
import { useClickOutside } from "@/hooks/useClickOutside";

import styles from "./colorPicker.module.scss";

const cx = classNames.bind(styles);

const MAX_RECENT_COLORS = 8;

interface ColorPickerProps {
  value?: string | null;
  resetColor?: string | null;
  onChange?: (color: string | null) => void;
  children?: ReactNode;
}

interface ColorButtonProps {
  color: string;
  resetColor: string | null;
  active: boolean;
  onClick: () => void;
}

/**
 * Không cho button lấy focus khỏi RichTextEditor.
 * Selection/caret vẫn được giữ nguyên.
 */
const preventEditorBlur = (event: MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

function ColorButton({ color, resetColor, active, onClick }: ColorButtonProps) {
  const isResetColor = color === resetColor;

  return (
    <button
      type="button"
      className={cx("color-picker__color", {
        "color-picker__color--active": active || isResetColor,
      })}
      style={{
        backgroundColor: color,
      }}
      aria-label={`Choose ${color}`}
      onMouseDown={preventEditorBlur}
      onClick={onClick}
    >
      {(active || isResetColor) && (
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

  const [open, setOpen] = useState(false);
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const colorPickerRef = useClickOutside<HTMLDivElement>(() => {
    setOpen(false);
    setShowCustomColor(false);
  });

  const addRecentColor = (color: string) => {
    setRecentColors((prev) =>
      [color, ...prev.filter((item) => item !== color)].slice(
        0,
        MAX_RECENT_COLORS,
      ),
    );
  };

  const closePicker = () => {
    setOpen(false);
    setShowCustomColor(false);
  };

  const selectColor = (color: string | null) => {
    onChange?.(color);
    closePicker();
  };

  const selectCustomColor = (color: string) => {
    addRecentColor(color);
    selectColor(color);
  };

  const handlePickColor = async () => {
    try {
      const color = await pickColor();

      if (color) {
        selectCustomColor(color);
      }
    } catch {
      // User cancelled EyeDropper or browser does not support it.
    }
  };

  const handleToggleOpen = () => {
    setOpen((prev) => !prev);
    setShowCustomColor(false);
  };

  const handleOpenCustomColor = () => {
    setShowCustomColor(true);
  };

  return (
    <div ref={colorPickerRef} className={cx("color-picker")}>
      {/* Trigger */}
      {children ? (
        <div
          className={cx("color-picker__trigger")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={handleToggleOpen}
        >
          {children}
        </div>
      ) : (
        <button
          type="button"
          className={cx("color-picker__trigger-button")}
          style={{
            backgroundColor: value ?? "transparent",
          }}
          aria-label="Choose text color"
          onMouseDown={preventEditorBlur}
          onClick={handleToggleOpen}
        >
          <Icon
            icon="mdi:format-color-fill"
            width={16}
            height={16}
            color={value ? getContrastColor(value) : undefined}
          />
        </button>
      )}

      {/* Color Picker */}
      {open && (
        <div className={cx("color-picker__popover")}>
          {/* Reset */}
          <button
            type="button"
            className={cx("color-picker__reset")}
            onMouseDown={preventEditorBlur}
            onClick={() => selectColor(resetColor)}
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
                resetColor={resetColor}
                active={value === color}
                onClick={() => selectColor(color)}
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
              onClick={handleOpenCustomColor}
            >
              Custom
            </button>

            <div className={cx("color-picker__custom-palette")}>
              {/* Recent Colors */}
              {recentColors.map((color) => (
                <ColorButton
                  key={color}
                  color={color}
                  resetColor={resetColor}
                  active={value === color}
                  onClick={() => selectColor(color)}
                />
              ))}

              {/* Custom Color */}
              <button
                type="button"
                className={cx("color-picker__action")}
                aria-label="Choose custom color"
                onMouseDown={preventEditorBlur}
                onClick={handleOpenCustomColor}
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
                onClick={handlePickColor}
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
              onChange={selectCustomColor}
            />
          )}
        </div>
      )}
    </div>
  );
}
