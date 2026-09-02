import { useState } from "react";
import classNames from "classnames/bind";

import FontPicker from "../index";

import styles from "./FontPickerTest.module.scss";

const cx = classNames.bind(styles);

export default function FontPickerTest() {
  const [fontFamily, setFontFamily] = useState("Arial");

  return (
    <main className={cx("page")}>
      <section className={cx("container")}>
        <h1 className={cx("title")}>Font Picker Test</h1>

        <div className={cx("picker")}>
          <FontPicker value={fontFamily} onChange={setFontFamily} />
        </div>

        <div className={cx("preview")}>
          <span className={cx("preview__label")}>Preview</span>

          <p className={cx("preview__text")} style={{ fontFamily }}>
            The quick brown fox jumps over the lazy dog
          </p>

          <p className={cx("preview__text")} style={{ fontFamily }}>
            Aa Bb Cc 1234567890
          </p>
        </div>

        <div className={cx("info")}>
          <span className={cx("info__label")}>Current font</span>

          <span className={cx("info__value")} style={{ fontFamily }}>
            {fontFamily}
          </span>
        </div>
      </section>
    </main>
  );
}
