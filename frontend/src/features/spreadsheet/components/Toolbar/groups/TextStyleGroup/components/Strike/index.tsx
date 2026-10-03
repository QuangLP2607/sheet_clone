import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import type { TextStyle } from "@/features/spreadsheet/types";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./Strike.module.scss";
const cx = classNames.bind(styles);

interface StrikeProps {
  value: TextStyle["strike"];
  updateTextStyle: (patch: Partial<TextStyle>) => void;
}

export default function Strike({ value, updateTextStyle }: StrikeProps) {
  return (
    <ToolbarButton
      className={cx("strike__button")}
      active={value}
      onClick={() => updateTextStyle({ strike: !value })}
    >
      {" "}
      <Icon icon="tabler:strikethrough" />{" "}
    </ToolbarButton>
  );
}
