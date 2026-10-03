import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import {
  type TextStyle,
  DEFAULT_TEXT_STYLE,
} from "@/features/spreadsheet/types";
import ToolbarButton from "../../../../base/ToolButton";
import ColorPicker from "@/components/ColorPicker";

import styles from "./TextColor.module.scss";
const cx = classNames.bind(styles);

interface TextColorProps {
  value: TextStyle["color"];
  updateTextStyle: (patch: Partial<TextStyle>) => void;
}

export default function TextColor({ value, updateTextStyle }: TextColorProps) {
  return (
    <ColorPicker
      value={value}
      resetColor={DEFAULT_TEXT_STYLE.color}
      onChange={(color) => updateTextStyle({ color })}
    >
      {({ open }) => (
        <ToolbarButton className={cx("text-color__button")} open={open}>
          <Icon className={cx("text-color__icon")} icon="fa7-solid:a" />

          <span
            className={cx("text-color__indicator")}
            style={{ backgroundColor: value }}
          />
        </ToolbarButton>
      )}
    </ColorPicker>
  );
}
