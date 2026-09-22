import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import ToolbarButton from "../../../../base/ToolButton";

import styles from "./MergeCells.module.scss";

const cx = classNames.bind(styles);

type MergeType =
  | "merge"
  | "merge-all"
  | "merge-vertical"
  | "merge-horizontal"
  | "unmerge";

interface MergeCellsProps {
  disabled?: boolean;
  value?: MergeType;
  onChange?: (type: MergeType) => void;
}

const MERGE_OPTIONS: {
  value: MergeType;
  label: string;
}[] = [
  {
    value: "merge-all",
    label: "Merge all",
  },
  {
    value: "merge-vertical",
    label: "Merge vertically",
  },
  {
    value: "merge-horizontal",
    label: "Merge horizontally",
  },
  {
    value: "unmerge",
    label: "Unmerge",
  },
];

export default function MergeCells({
  disabled = false,
  onChange,
}: MergeCellsProps) {
  const handleMerge = () => {
    onChange?.("merge");
  };

  return (
    <div className={cx("merge-cells")}>
      <ToolbarButton
        disabled={disabled}
        aria-label="Merge cells"
        onClick={handleMerge}
        className={cx("merge-cells__button")}
      >
        <Icon icon="material-symbols:cell-merge" />
      </ToolbarButton>

      <Dropdown
        align="start"
        trigger={({ toggle, open }) => (
          <ToolbarButton
            disabled={disabled}
            open={open}
            aria-label="Merge options"
            aria-expanded={open}
            onClick={toggle}
            className={cx("merge-cells__dropdown-button")}
          >
            <Icon
              icon="material-symbols:arrow-drop-down-rounded"
              className={cx("merge-cells__arrow", {
                "merge-cells__arrow--open": open,
              })}
            />
          </ToolbarButton>
        )}
      >
        {({ close }) => (
          <div className={cx("merge-cells__menu")}>
            {MERGE_OPTIONS.map((option) => (
              <ToolbarButton
                key={option.value}
                className={cx("merge-cells__option")}
                onClick={() => {
                  onChange?.(option.value);
                  close();
                }}
              >
                <span>{option.label}</span>
              </ToolbarButton>
            ))}
          </div>
        )}
      </Dropdown>
    </div>
  );
}
