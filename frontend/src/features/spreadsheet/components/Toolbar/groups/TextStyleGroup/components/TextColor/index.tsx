import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import ToolbarButton from "../../../../base/ToolButton";
import ColorPicker from "@/components/ColorPicker";

import styles from "./TextColor.module.scss";

const cx = classNames.bind(styles);

const DEFAULT_TEXT_COLOR = "#000000";

interface TextColorProps {
  color: string | null;
  setColor: (color: string | null) => void;
}

export default function TextColor({ color, setColor }: TextColorProps) {
  const displayColor = color ?? DEFAULT_TEXT_COLOR;

  const handleColorChange = (nextColor: string) => {
    setColor(nextColor === DEFAULT_TEXT_COLOR ? null : nextColor);
  };

  return (
    <ColorPicker
      value={displayColor}
      resetColor={DEFAULT_TEXT_COLOR}
      onChange={handleColorChange}
    >
      {({ open }) => (
        <ToolbarButton className={cx("text-color__button")} open={open}>
          <Icon className={cx("text-color__icon")} icon="fa7-solid:a" />

          <span
            className={cx("text-color__indicator")}
            style={{
              backgroundColor: displayColor,
            }}
          />
        </ToolbarButton>
      )}
    </ColorPicker>
  );
}
