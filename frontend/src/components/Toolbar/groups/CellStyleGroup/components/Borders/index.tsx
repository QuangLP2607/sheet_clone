import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import ColorPicker from "@/components/ColorPicker";
import Dropdown from "@/components/Dropdown";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./Borders.module.scss";

const cx = classNames.bind(styles);

type BorderType =
  | "all"
  | "inner"
  | "horizontal"
  | "vertical"
  | "outer"
  | "left"
  | "top"
  | "right"
  | "bottom"
  | "none";

type BorderStyle = "solid" | "dashed" | "dotted" | "double";

interface BordersProps {
  disabled?: boolean;

  value?: BorderType;
  onChange?: (border: BorderType) => void;

  color?: string | null;
  onColorChange?: (color: string | null) => void;

  borderStyle?: BorderStyle;
  onBorderStyleChange?: (style: BorderStyle) => void;
}

const BORDER_OPTIONS = [
  ["all", "material-symbols:border-all"],
  ["inner", "material-symbols:border-inner"],
  ["horizontal", "material-symbols:border-horizontal"],
  ["vertical", "material-symbols:border-vertical"],
  ["outer", "material-symbols:border-outer"],
  ["left", "material-symbols:border-left"],
  ["top", "material-symbols:border-top"],
  ["right", "material-symbols:border-right"],
  ["bottom", "material-symbols:border-bottom"],
  ["none", "material-symbols:border-clear"],
] as const satisfies readonly [BorderType, string][];

const BORDER_STYLES = [
  ["solid", "Solid"],
  ["dashed", "Dashed"],
  ["dotted", "Dotted"],
  ["double", "Double"],
] as const satisfies readonly [BorderStyle, string][];

export default function Borders({
  disabled = false,
  value = "all",
  onChange,
  color = "#000000",
  onColorChange,
  borderStyle = "solid",
  onBorderStyleChange,
}: BordersProps) {
  const currentIcon =
    BORDER_OPTIONS.find(([type]) => type === value)?.[1] ??
    "material-symbols:border-all";

  return (
    <Dropdown
      trigger={({ toggle, open }) => (
        <ToolbarButton
          disabled={disabled}
          open={open}
          onClick={toggle}
          aria-label="Borders"
        >
          <Icon icon={currentIcon} />

          <Icon
            icon="material-symbols:arrow-drop-down-rounded"
            className={cx("borders__arrow", {
              "borders__arrow--open": open,
            })}
          />
        </ToolbarButton>
      )}
    >
      {({ close }) => (
        <div className={cx("borders__dropdown")}>
          <div className={cx("borders__options")}>
            {BORDER_OPTIONS.map(([type, icon]) => (
              <ToolbarButton
                key={type}
                active={value === type}
                aria-label={type}
                onClick={() => {
                  onChange?.(type);
                  close();
                }}
              >
                <Icon icon={icon} />
              </ToolbarButton>
            ))}
          </div>

          <div className={cx("borders__settings")}>
            <ColorPicker value={color} onChange={onColorChange}>
              {({ open }) => (
                <ToolbarButton
                  disabled={disabled}
                  open={open}
                  aria-label="Border color"
                >
                  <span className={cx("borders__color")}>
                    <Icon icon="material-symbols:border-color" />

                    <span
                      className={cx("borders__color-preview")}
                      style={{
                        backgroundColor: color ?? "#000000",
                      }}
                    />
                  </span>

                  <Icon
                    icon="material-symbols:arrow-drop-down-rounded"
                    className={cx("borders__arrow", {
                      "borders__arrow--open": open,
                    })}
                  />
                </ToolbarButton>
              )}
            </ColorPicker>

            <Dropdown
              trigger={({ toggle, open }) => (
                <ToolbarButton
                  disabled={disabled}
                  open={open}
                  onClick={toggle}
                  aria-label="Border style"
                >
                  <span
                    className={cx(
                      "borders__style-preview",
                      `borders__style-preview--${borderStyle}`,
                    )}
                  />

                  <Icon
                    icon="material-symbols:arrow-drop-down-rounded"
                    className={cx("borders__arrow", {
                      "borders__arrow--open": open,
                    })}
                  />
                </ToolbarButton>
              )}
            >
              {({ close: closeStyle }) => (
                <div className={cx("borders__style-dropdown")}>
                  {BORDER_STYLES.map(([style, label]) => (
                    <ToolbarButton
                      key={style}
                      active={borderStyle === style}
                      aria-label={label}
                      className={cx("borders__style-option")}
                      onClick={() => {
                        onBorderStyleChange?.(style);
                        closeStyle();
                      }}
                    >
                      <span
                        className={cx(
                          "borders__style-preview",
                          `borders__style-preview--${style}`,
                        )}
                      />
                    </ToolbarButton>
                  ))}
                </div>
              )}
            </Dropdown>
          </div>
        </div>
      )}
    </Dropdown>
  );
}
