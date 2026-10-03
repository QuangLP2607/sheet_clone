import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import type { CellStyle } from "@/features/spreadsheet/types";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./HorizontalAlign.module.scss";

const cx = classNames.bind(styles);

interface HorizontalAlignProps {
  value: CellStyle["horizontalAlign"];
  updateCellStyle: (patch: Partial<CellStyle>) => void;
  disabled?: boolean;
}

const ALIGN_OPTIONS: {
  value: CellStyle["horizontalAlign"];
  icon: string;
}[] = [
  {
    value: "left",
    icon: "material-symbols:format-align-left",
  },
  {
    value: "center",
    icon: "material-symbols:format-align-center",
  },
  {
    value: "right",
    icon: "material-symbols:format-align-right",
  },
];

export default function HorizontalAlign({
  disabled = false,
  value,
  updateCellStyle,
}: HorizontalAlignProps) {
  const currentOption =
    ALIGN_OPTIONS.find((option) => option.value === value) ?? ALIGN_OPTIONS[0];

  return (
    <Dropdown
      trigger={({ toggle, open }) => (
        <ToolbarButton disabled={disabled} open={open} onClick={toggle}>
          <Icon icon={currentOption.icon} />

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
          {ALIGN_OPTIONS.map((option) => (
            <ToolbarButton
              key={option.value}
              active={value === option.value}
              onClick={() => {
                updateCellStyle({
                  horizontalAlign: option.value,
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
