import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import type { CellStyle } from "@/features/spreadsheet/types";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./VerticalAlign.module.scss";

const cx = classNames.bind(styles);

interface VerticalAlignProps {
  value: CellStyle["verticalAlign"];
  updateCellStyle: (patch: Partial<CellStyle>) => void;
  disabled?: boolean;
}

const ALIGN_OPTIONS: {
  value: CellStyle["verticalAlign"];
  icon: string;
}[] = [
  {
    value: "top",
    icon: "material-symbols:vertical-align-top",
  },
  {
    value: "middle",
    icon: "material-symbols:vertical-align-center",
  },
  {
    value: "bottom",
    icon: "material-symbols:vertical-align-bottom",
  },
];

export default function VerticalAlign({
  disabled = false,
  value,
  updateCellStyle,
}: VerticalAlignProps) {
  const currentOption =
    ALIGN_OPTIONS.find((option) => option.value === value) ?? ALIGN_OPTIONS[0];

  return (
    <Dropdown
      trigger={({ toggle, open }) => (
        <ToolbarButton disabled={disabled} open={open} onClick={toggle}>
          <Icon icon={currentOption.icon} />

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
          {ALIGN_OPTIONS.map((option) => (
            <ToolbarButton
              key={option.value}
              active={value === option.value}
              onClick={() => {
                updateCellStyle({
                  verticalAlign: option.value,
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
