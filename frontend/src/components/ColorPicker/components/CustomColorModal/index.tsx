import { useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./customColorModal.module.scss";
import {
  hexToHsv,
  hsvToHex,
  hsvToRgb,
  type HSV,
} from "../../utils/colorConversion";

const cx = classNames.bind(styles);

interface CustomColorModalProps {
  value?: string | null;
  onClose: () => void;
  onChange: (color: string) => void;
}

export default function CustomColorModal({
  value,
  onClose,
  onChange,
}: CustomColorModalProps) {
  const initialColor = value ?? "#000000";

  const [hsva, setHsva] = useState<HSV>(() => hexToHsv(initialColor));

  const [hex, setHex] = useState(initialColor);

  const colorAreaRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  /*
   * =========================
   * CURRENT COLOR
   * =========================
   */

  const color = hsvToHex(hsva);
  const rgb = hsvToRgb(hsva);

  /*
   * =========================
   * UPDATE HSV
   * =========================
   */

  const updateHsva = (next: HSV) => {
    setHsva(next);
    setHex(hsvToHex(next));
  };

  /*
   * =========================
   * COLOR AREA
   * =========================
   */

  const updateColorArea = (clientX: number, clientY: number) => {
    const element = colorAreaRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const saturation = Math.min(
      Math.max((clientX - rect.left) / rect.width, 0),
      1,
    );

    const value = Math.min(
      Math.max(1 - (clientY - rect.top) / rect.height, 0),
      1,
    );

    updateHsva({
      ...hsva,
      s: saturation,
      v: value,
    });
  };

  const handleColorAreaPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    updateColorArea(event.clientX, event.clientY);
  };

  const handleColorAreaPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.buttons !== 1 ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      return;
    }

    updateColorArea(event.clientX, event.clientY);
  };

  /*
   * =========================
   * HUE SLIDER
   * =========================
   */

  const updateHue = (clientX: number) => {
    const element = hueRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const hue = Math.min(
      Math.max(((clientX - rect.left) / rect.width) * 360, 0),
      360,
    );

    updateHsva({
      ...hsva,
      h: hue,
    });
  };

  const handleHuePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    updateHue(event.clientX);
  };

  const handleHuePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.buttons !== 1 ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      return;
    }

    updateHue(event.clientX);
  };

  /*
   * =========================
   * HEX INPUT
   * =========================
   */

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = event.target.value;

    setHex(newHex);

    if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
      setHsva(hexToHsv(newHex));
    }
  };

  /*
   * =========================
   * RGB INPUT
   * =========================
   */

  const updateRgb = (channel: "r" | "g" | "b", value: string) => {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    const nextValue = Math.min(Math.max(parsedValue, 0), 255);

    const nextRgb = {
      ...rgb,
      [channel]: nextValue,
    };

    /*
     * RGB → HSV
     *
     * Tạm dùng HEX làm cầu nối:
     *
     * RGB → HEX → HSV
     */

    const nextHex =
      `#${nextRgb.r.toString(16).padStart(2, "0")}` +
      `${nextRgb.g.toString(16).padStart(2, "0")}` +
      `${nextRgb.b.toString(16).padStart(2, "0")}`;

    const nextHsva = hexToHsv(nextHex);

    setHsva(nextHsva);
    setHex(nextHex);
  };

  /*
   * =========================
   * APPLY
   * =========================
   */

  const handleApply = () => {
    onChange(color);
    onClose();
  };

  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <div className={cx("overlay")}>
      <div
        className={cx("modal")}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={cx("content")}>
          {/* Color Area */}
          <div
            ref={colorAreaRef}
            className={cx("colorArea")}
            style={{
              backgroundColor: `hsl(${hsva.h}, 100%, 50%)`,
            }}
            onPointerDown={handleColorAreaPointerDown}
            onPointerMove={handleColorAreaPointerMove}
          >
            <div className={cx("whiteGradient")} />

            <div className={cx("blackGradient")} />

            <div
              className={cx("colorCursor")}
              style={{
                left: `${hsva.s * 100}%`,
                top: `${(1 - hsva.v) * 100}%`,
                backgroundColor: color,
              }}
            />
          </div>
          {/* Preview + Hue */}
          <div className={cx("section")}>
            <div
              className={cx("colorPreview")}
              style={{
                backgroundColor: color,
              }}
            />

            <div
              ref={hueRef}
              className={cx("hueSlider")}
              onPointerDown={handleHuePointerDown}
              onPointerMove={handleHuePointerMove}
            >
              <div
                className={cx("hueCursor")}
                style={{
                  left: `${(hsva.h / 360) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>

          {/* Color Values */}
          <div className={cx("colorValue")}>
            {/* HEX */}
            <label className={cx("colorInput")}>
              <span>HEX</span>

              <input
                type="text"
                value={hex}
                maxLength={7}
                onChange={handleHexChange}
                aria-label="HEX color"
              />
            </label>

            {/* RED */}
            <label className={cx("colorInput")}>
              <span>R</span>

              <input
                type="number"
                value={rgb.r}
                min={0}
                max={255}
                onChange={(event) => updateRgb("r", event.target.value)}
                aria-label="Red"
              />
            </label>

            {/* GREEN */}
            <label className={cx("colorInput")}>
              <span>G</span>

              <input
                type="number"
                value={rgb.g}
                min={0}
                max={255}
                onChange={(event) => updateRgb("g", event.target.value)}
                aria-label="Green"
              />
            </label>

            {/* BLUE */}
            <label className={cx("colorInput")}>
              <span>B</span>

              <input
                type="number"
                value={rgb.b}
                min={0}
                max={255}
                onChange={(event) => updateRgb("b", event.target.value)}
                aria-label="Blue"
              />
            </label>
          </div>
        </div>

        {/* Footer */}

        <div className={cx("footer")}>
          <button
            type="button"
            className={cx("cancelButton")}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className={cx("applyButton")}
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
