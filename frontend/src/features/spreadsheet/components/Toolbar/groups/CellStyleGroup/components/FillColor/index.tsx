import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import ToolbarButton from "../../../../base/ToolButton";
import ColorPicker from "@/components/ColorPicker";

import styles from "./FillColor.module.scss";

const cx = classNames.bind(styles);

const DEFAULT_FILL_COLOR = "#ffffff";

interface FillColorProps {
  color: string | null;
  setColor: (color: string | null) => void;
}

export default function FillColor({ color, setColor }: FillColorProps) {
  const displayColor = color ?? DEFAULT_FILL_COLOR;

  const handleColorChange = (nextColor: string) => {
    setColor(nextColor === DEFAULT_FILL_COLOR ? null : nextColor);
  };

  return (
    <ColorPicker
      value={displayColor}
      resetColor={DEFAULT_FILL_COLOR}
      onChange={handleColorChange}
    >
      {({ open }) => (
        <ToolbarButton className={cx("fill-color__button")} open={open}>
          <Icon
            className={cx("fill-color__icon")}
            icon="mdi:format-color-fill"
          />

          <span
            className={cx("fill-color__indicator")}
            style={{
              backgroundColor: displayColor,
            }}
          />
        </ToolbarButton>
      )}
    </ColorPicker>
  );
}
