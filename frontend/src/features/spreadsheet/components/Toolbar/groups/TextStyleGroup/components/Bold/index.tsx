import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import ToolbarButton from "../../../../base/ToolButton";

import styles from "./Bold.module.scss";

const cx = classNames.bind(styles);

interface BoldProps {
  active: boolean;
  onClick: () => void;
}

export default function Bold({ active, onClick }: BoldProps) {
  return (
    <ToolbarButton
      className={cx("bold__button")}
      active={active}
      onClick={onClick}
    >
      <Icon icon="tabler:bold" />
    </ToolbarButton>
  );
}
