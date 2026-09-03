import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./HorizontalAlign.module.scss";

const cx = classNames.bind(styles);

interface HorizontalAlignProps {
  disabled?: boolean;
  value?: "left" | "center" | "right";
  onChange?: (align: "left" | "center" | "right") => void;
}

export default function HorizontalAlign({
  disabled = false,
  value = "left",
  onChange,
}: HorizontalAlignProps) {
  const icon =
    value === "center"
      ? "material-symbols:format-align-center"
      : value === "right"
        ? "material-symbols:format-align-right"
        : "material-symbols:format-align-left";

  return (
    <Dropdown
      trigger={({ toggle, open }) => (
        <ToolbarButton disabled={disabled} open={open} onClick={toggle}>
          <Icon icon={icon} />

          <Icon
            icon="material-symbols:arrow-drop-down-rounded"
            className={cx("horizontal-align__arrow", {
              "horizontal-align__arrow--open": open,
            })}
          />
        </ToolbarButton>
      )}
    >
      {({ close }) => (
        <div className={cx("horizontal-align__dropdown")}>
          <ToolbarButton
            active={value === "left"}
            onClick={() => {
              onChange?.("left");
              close();
            }}
          >
            <Icon icon="material-symbols:format-align-left" />
          </ToolbarButton>

          <ToolbarButton
            active={value === "center"}
            onClick={() => {
              onChange?.("center");
              close();
            }}
          >
            <Icon icon="material-symbols:format-align-center" />
          </ToolbarButton>

          <ToolbarButton
            active={value === "right"}
            onClick={() => {
              onChange?.("right");
              close();
            }}
          >
            <Icon icon="material-symbols:format-align-right" />
          </ToolbarButton>
        </div>
      )}
    </Dropdown>
  );
}
