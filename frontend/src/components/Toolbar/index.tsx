import { useState } from "react";

import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import ToolbarButton from "./base/ToolButton";

import UtilityGroup from "./groups/UtilityGroup";
import FontGroup from "./groups/FontGroup";
import FontSizeGroup from "./groups/FontSizeGroup";
import TextStyleGroup from "./groups/TextStyleGroup";
import CellStyleGroup from "./groups/CellStyleGroup";
import AlignmentGroup from "./groups/AlignmentGroup";

import {
  GROUPS,
  type GroupName,
  useToolbarOverflow,
} from "./hooks/useToolbarOverflow";

import type { TextStyle } from "@/types/richText";

import styles from "./toolbar.module.scss";

const cx = classNames.bind(styles);

export interface ToolbarProps {
  textStyle: TextStyle;

  toggleBold: () => void;
  toggleItalic: () => void;
  toggleStrike: () => void;

  setColor: (color: string | null) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (fontFamily: string) => void;
}

export default function Toolbar({
  textStyle,
  toggleBold,
  toggleItalic,
  toggleStrike,
  setColor,
  setFontSize,
  setFontFamily,
}: ToolbarProps) {
  const [open, setOpen] = useState(false);

  const { toolbarRef, visibleGroups, overflowGroups, setMeasureRef } =
    useToolbarOverflow();

  const renderGroup = (group: GroupName) => {
    switch (group) {
      case "utility":
        return <UtilityGroup />;

      case "font":
        return (
          <FontGroup value={textStyle.fontFamily} onChange={setFontFamily} />
        );

      case "fontSize":
        return (
          <FontSizeGroup textStyle={textStyle} setFontSize={setFontSize} />
        );

      case "textStyle":
        return (
          <TextStyleGroup
            textStyle={textStyle}
            toggleBold={toggleBold}
            toggleItalic={toggleItalic}
            toggleStrike={toggleStrike}
            setColor={setColor}
          />
        );

      case "cellStyle":
        return <CellStyleGroup />;

      case "alignment":
        return <AlignmentGroup />;

      default:
        return null;
    }
  };

  const hasOverflow = overflowGroups.length > 0;

  return (
    <div className={cx("toolbar-wrapper")}>
      <div ref={toolbarRef} className={cx("toolbar")}>
        <div className={cx("toolbar__content")}>
          {visibleGroups.map((group) => (
            <div key={group} className={cx("toolbar__group")}>
              {renderGroup(group)}
            </div>
          ))}
        </div>

        {hasOverflow && (
          <ToolbarButton
            onClick={() => setOpen((value) => !value)}
            open={open}
            aria-label="More"
            aria-expanded={open}
          >
            <Icon icon="bi:three-dots-vertical" />
          </ToolbarButton>
        )}
      </div>

      {hasOverflow && open && (
        <div className={cx("toolbar__overflow")}>
          {overflowGroups.map((group) => (
            <div key={group} className={cx("toolbar__overflow-group")}>
              {renderGroup(group)}
            </div>
          ))}
        </div>
      )}

      <div className={cx("toolbar__measure")}>
        {GROUPS.map((group) => (
          <div
            key={group}
            ref={setMeasureRef(group)}
            className={cx("toolbar__measure-group")}
          >
            {renderGroup(group)}
          </div>
        ))}
      </div>
    </div>
  );
}
