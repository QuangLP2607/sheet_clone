import classNames from "classnames/bind";

import SharedToolbar from "@/tests/SharedToolbar";
import styles from "./home.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <div className={cx("wrapper")}>
      <SharedToolbar />
    </div>
  );
}
