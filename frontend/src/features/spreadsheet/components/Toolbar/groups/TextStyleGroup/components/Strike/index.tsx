import ToolbarButton from "../../../../base/ToolButton";
import classNames from "classnames/bind";
import styles from "./Strike.module.scss";

import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

interface StrikeProps {
  active: boolean;
  onClick: () => void;
}

export default function Strike({ active, onClick }: StrikeProps) {
  return (
    <ToolbarButton
      className={cx("strike__button")}
      active={active}
      onClick={onClick}
    >
      <Icon icon="tabler:strikethrough" />
    </ToolbarButton>
  );
}
