import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./VerticalAlign.module.scss";

const cx = classNames.bind(styles);

interface VerticalAlignProps {
  disabled?: boolean;
  value?: "top" | "middle" | "bottom";
  onChange?: (align: "top" | "middle" | "bottom") => void;
}

export default function VerticalAlign({
  disabled = false,
  value = "top",
  onChange,
}: VerticalAlignProps) {
  const icon =
    value === "middle"
      ? "material-symbols:vertical-align-center"
      : value === "bottom"
        ? "material-symbols:vertical-align-bottom"
        : "material-symbols:vertical-align-top";

  return (
    <Dropdown
      trigger={({ toggle, open }) => (
        <ToolbarButton disabled={disabled} open={open} onClick={toggle}>
          <Icon icon={icon} />

          <Icon
            icon="material-symbols:arrow-drop-down-rounded"
            className={cx("vertical-align__arrow", {
              "vertical-align__arrow--open": open,
            })}
          />
        </ToolbarButton>
      )}
    >
      {({ close }) => (
        <div className={cx("vertical-align__dropdown")}>
          <ToolbarButton
            active={value === "top"}
            onClick={() => {
              onChange?.("top");
              close();
            }}
          >
            <Icon icon="material-symbols:vertical-align-top" />
          </ToolbarButton>

          <ToolbarButton
            active={value === "middle"}
            onClick={() => {
              onChange?.("middle");
              close();
            }}
          >
            <Icon icon="material-symbols:vertical-align-center" />
          </ToolbarButton>

          <ToolbarButton
            active={value === "bottom"}
            onClick={() => {
              onChange?.("bottom");
              close();
            }}
          >
            <Icon icon="material-symbols:vertical-align-bottom" />
          </ToolbarButton>
        </div>
      )}
    </Dropdown>
  );
}
