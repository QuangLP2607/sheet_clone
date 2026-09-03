import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import ToolbarButton from "../../../../base/ToolButton";
import ColorPicker from "@/components/ColorPicker";

import styles from "./FillColor.module.scss";

const cx = classNames.bind(styles);

interface FillColorProps {
  color: string | null;
  setColor: (color: string | null) => void;
}

export default function FillColor({ color, setColor }: FillColorProps) {
  return (
    <ColorPicker value={color} resetColor="#ffffff" onChange={setColor}>
      {({ open }) => (
        <ToolbarButton className={cx("fill-color__button")} open={open}>
          <Icon
            className={cx("fill-color__icon")}
            icon="mdi:format-color-fill"
          />

          <span
            className={cx("fill-color__indicator")}
            style={{
              backgroundColor: color ?? "transparent",
            }}
          />
        </ToolbarButton>
      )}
    </ColorPicker>
  );
}
