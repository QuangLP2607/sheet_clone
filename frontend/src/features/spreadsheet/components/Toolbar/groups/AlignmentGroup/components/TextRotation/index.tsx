import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./TextRotation.module.scss";

const cx = classNames.bind(styles);

type TextRotationValue =
  | "none"
  | "angledown"
  | "angleup"
  | "rotate-up"
  | "rotate-down"
  | "vertical";

interface TextRotationProps {
  disabled?: boolean;
  value?: TextRotationValue;
  onChange?: (rotation: TextRotationValue) => void;
}

const ROTATION_OPTIONS: {
  value: TextRotationValue;
  icon: string;
}[] = [
  {
    value: "none",
    icon: "material-symbols:text-rotation-none",
  },
  {
    value: "angledown",
    icon: "material-symbols:text-rotation-angledown",
  },
  {
    value: "angleup",
    icon: "material-symbols:text-rotation-angleup",
  },
  {
    value: "rotate-up",
    icon: "material-symbols:text-rotate-up",
  },
  {
    value: "rotate-down",
    icon: "material-symbols:text-rotation-down",
  },
  {
    value: "vertical",
    icon: "material-symbols:text-rotate-vertical",
  },
];

export default function TextRotation({
  disabled = false,
  value = "none",
  onChange,
}: TextRotationProps) {
  const currentOption =
    ROTATION_OPTIONS.find((option) => option.value === value) ??
    ROTATION_OPTIONS[0];

  return (
    <Dropdown
      trigger={({ toggle, open }) => (
        <ToolbarButton disabled={disabled} open={open} onClick={toggle}>
          <Icon icon={currentOption.icon} />

          <Icon
            icon="material-symbols:arrow-drop-down-rounded"
            className={cx("text-rotation__arrow", {
              "text-rotation__arrow--open": open,
            })}
          />
        </ToolbarButton>
      )}
    >
      {({ close }) => (
        <div className={cx("text-rotation__dropdown")}>
          {ROTATION_OPTIONS.map((option) => (
            <ToolbarButton
              key={option.value}
              active={value === option.value}
              onClick={() => {
                onChange?.(option.value);
                close();
              }}
            >
              <Icon icon={option.icon} />
            </ToolbarButton>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
