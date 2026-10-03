import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import type { CellStyle } from "@/features/spreadsheet/types";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./TextWrapping.module.scss";

const cx = classNames.bind(styles);

interface TextWrappingProps {
  value: CellStyle["textWrapping"];
  updateCellStyle: (patch: Partial<CellStyle>) => void;
  disabled?: boolean;
}

const WRAPPING_OPTIONS: {
  value: CellStyle["textWrapping"];
  icon: string;
}[] = [
  {
    value: "overflow",
    icon: "material-symbols:format-text-overflow",
  },
  {
    value: "wrap",
    icon: "material-symbols:format-text-wrap",
  },
  {
    value: "clip",
    icon: "material-symbols:format-text-clip",
  },
];

export default function TextWrapping({
  disabled = false,
  value,
  updateCellStyle,
}: TextWrappingProps) {
  const currentOption =
    WRAPPING_OPTIONS.find((option) => option.value === value) ??
    WRAPPING_OPTIONS[0];

  return (
    <Dropdown
      trigger={({ toggle, open }) => (
        <ToolbarButton disabled={disabled} open={open} onClick={toggle}>
          <Icon icon={currentOption.icon} />

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
          {WRAPPING_OPTIONS.map((option) => (
            <ToolbarButton
              key={option.value}
              active={value === option.value}
              onClick={() => {
                updateCellStyle({
                  textWrapping: option.value,
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
