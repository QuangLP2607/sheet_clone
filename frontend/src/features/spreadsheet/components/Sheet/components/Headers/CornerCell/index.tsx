import classNames from "classnames/bind";

import styles from "./CornerCell.module.scss";

const cx = classNames.bind(styles);

interface CornerCellProps {
  width: number;
  height: number;
}

export default function CornerCell({ width, height }: CornerCellProps) {
  return (
    <div
      className={cx("corner")}
      style={{
        width,
        height,
      }}
    />
  );
}
