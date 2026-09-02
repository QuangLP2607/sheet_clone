import classNames from "classnames/bind";
import styles from "./sheet.module.scss";

const cx = classNames.bind(styles);

export default function Sheet() {
  return (
    <div className={cx("wrapper")}>
      <input></input>
    </div>
  );
}
