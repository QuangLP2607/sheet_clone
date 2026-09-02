import ToolbarButton from "../../../../base/ToolButton";
import classNames from "classnames/bind";
import styles from "./Italic.module.scss";

import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

interface ItalicProps {
  active: boolean;
  onClick: () => void;
}

export default function Italic({ active, onClick }: ItalicProps) {
  return (
    <ToolbarButton
      className={cx("italic__button")}
      active={active}
      onClick={onClick}
    >
      <Icon icon="tabler:italic" />
    </ToolbarButton>
  );
}
