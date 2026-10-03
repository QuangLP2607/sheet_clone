import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import {
  type CellStyle,
  DEFAULT_CELL_STYLE,
} from "@/features/spreadsheet/types";
import ToolbarButton from "../../../../base/ToolButton";
import ColorPicker from "@/components/ColorPicker";

import styles from "./FillColor.module.scss";

const cx = classNames.bind(styles);

interface FillColorProps {
  value: CellStyle["fillColor"];
  updateCellStyle: (patch: Partial<CellStyle>) => void;
}

export default function FillColor({ value, updateCellStyle }: FillColorProps) {
  return (
    <ColorPicker
      value={value}
      resetColor={DEFAULT_CELL_STYLE.fillColor}
      onChange={(color) => updateCellStyle({ fillColor: color })}
    >
      {({ open }) => (
        <ToolbarButton className={cx("fill-color__button")} open={open}>
          <Icon
            className={cx("fill-color__icon")}
            icon="mdi:format-color-fill"
          />

          <span
            className={cx("fill-color__indicator")}
            style={{ backgroundColor: value }}
          />
        </ToolbarButton>
      )}
    </ColorPicker>
  );
}
