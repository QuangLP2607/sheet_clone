import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import type { TextStyle } from "@/features/spreadsheet/types";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./Bold.module.scss";
const cx = classNames.bind(styles);

interface BoldProps {
  value: TextStyle["bold"];
  updateTextStyle: (patch: Partial<TextStyle>) => void;
}

export default function Bold({ value, updateTextStyle }: BoldProps) {
  return (
    <ToolbarButton
      className={cx("bold__button")}
      active={value}
      onClick={() => updateTextStyle({ bold: !value })}
    >
      <Icon icon="tabler:bold" />
    </ToolbarButton>
  );
}
