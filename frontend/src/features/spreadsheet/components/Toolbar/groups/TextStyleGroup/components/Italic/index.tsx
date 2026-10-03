import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import type { TextStyle } from "@/features/spreadsheet/types";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./Italic.module.scss";
const cx = classNames.bind(styles);

interface ItalicProps {
  value: TextStyle["italic"];
  updateTextStyle: (patch: Partial<TextStyle>) => void;
}

export default function Italic({ value, updateTextStyle }: ItalicProps) {
  return (
    <ToolbarButton
      className={cx("italic__button")}
      active={value}
      onClick={() => updateTextStyle({ italic: !value })}
    >
      {" "}
      <Icon icon="tabler:italic" />{" "}
    </ToolbarButton>
  );
}
