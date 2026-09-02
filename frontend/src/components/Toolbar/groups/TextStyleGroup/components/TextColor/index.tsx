import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import ToolbarButton from "../../../../base/ToolButton";
import ColorPicker from "@/components/ColorPicker";

import styles from "./TextColor.module.scss";

const cx = classNames.bind(styles);

interface TextColorProps {
  color: string | null;
  setColor: (color: string | null) => void;
}

export default function TextColor({ color, setColor }: TextColorProps) {
  return (
    <ColorPicker value={color} resetColor="#000000" onChange={setColor}>
      <ToolbarButton className={cx("text-color__button")}>
        <Icon className={cx("text-color__icon")} icon="fa7-solid:a" />

        <span
          className={cx("text-color__indicator")}
          style={{
            backgroundColor: color ?? "transparent",
          }}
        />
      </ToolbarButton>
    </ColorPicker>
  );
}
