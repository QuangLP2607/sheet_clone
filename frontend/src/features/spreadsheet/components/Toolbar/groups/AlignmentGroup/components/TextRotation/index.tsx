import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import { type CellStyle } from "@/features/spreadsheet/types";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./TextRotation.module.scss";

const cx = classNames.bind(styles);

interface TextRotationProps {
  value: CellStyle["textRotation"];
  updateCellStyle: (patch: Partial<CellStyle>) => void;
  disabled?: boolean;
}

const ROTATION_OPTIONS: {
  value: CellStyle["textRotation"];
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
  value,
  updateCellStyle,
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
                updateCellStyle({
                  textRotation: option.value,
                });
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
