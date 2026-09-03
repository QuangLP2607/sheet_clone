import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./TextWrapping.module.scss";

const cx = classNames.bind(styles);

interface TextWrappingProps {
  disabled?: boolean;
  value?: "overflow" | "wrap" | "clip";
  onChange?: (wrapping: "overflow" | "wrap" | "clip") => void;
}

export default function TextWrapping({
  disabled = false,
  value = "overflow",
  onChange,
}: TextWrappingProps) {
  const icon =
    value === "wrap"
      ? "material-symbols:format-text-wrap"
      : value === "clip"
        ? "material-symbols:format-text-clip"
        : "material-symbols:format-text-overflow";

  return (
    <Dropdown
      trigger={({ toggle, open }) => (
        <ToolbarButton disabled={disabled} open={open} onClick={toggle}>
          <Icon icon={icon} />

          <Icon
            icon="material-symbols:arrow-drop-down-rounded"
            className={cx("text-wrapping__arrow", {
              "text-wrapping__arrow--open": open,
            })}
          />
        </ToolbarButton>
      )}
    >
      {({ close }) => (
        <div className={cx("text-wrapping__dropdown")}>
          {/* Overflow */}
          <ToolbarButton
            active={value === "overflow"}
            onClick={() => {
              onChange?.("overflow");
              close();
            }}
          >
            <Icon icon="material-symbols:format-text-overflow" />
          </ToolbarButton>

          {/* Wrap */}
          <ToolbarButton
            active={value === "wrap"}
            onClick={() => {
              onChange?.("wrap");
              close();
            }}
          >
            <Icon icon="material-symbols:format-text-wrap" />
          </ToolbarButton>

          {/* Clip */}
          <ToolbarButton
            active={value === "clip"}
            onClick={() => {
              onChange?.("clip");
              close();
            }}
          >
            <Icon icon="material-symbols:format-text-clip" />
          </ToolbarButton>
        </div>
      )}
    </Dropdown>
  );
}
