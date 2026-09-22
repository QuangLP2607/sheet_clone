import { Fragment, useCallback, useLayoutEffect, useRef } from "react";

import type { Editor } from "@tiptap/react";
import classNames from "classnames/bind";

import type { CellStyle } from "@/types/cell-style";

import UtilityGroup from "./groups/UtilityGroup";
import FontGroup from "./groups/FontGroup";
import FontSizeGroup from "./groups/FontSizeGroup";
import TextStyleGroup from "./groups/TextStyleGroup";
import CellStyleGroup from "./groups/CellStyleGroup";
import AlignmentGroup from "./groups/AlignmentGroup";

import ToolbarMeasureItem from "./responsive/measure/ToolbarMeasureItem";
import ToolbarOverflow from "./responsive/overflow/ToolbarOverflow";

import {
  GROUPS,
  MORE_WIDTH,
  useToolbarOverflow,
} from "./responsive/overflow/useToolbarOverflow";

import { useToolbar } from "./hooks/useToolbar";

import type { ToolGroupMode } from "./base/ToolGroup";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

export interface ToolbarProps {
  /*
   * Cell hiện tại đang editing.
   */
  editing: boolean;

  /*
   * Cell hiện tại mà Toolbar đang thao tác.
   *
   * Thường truyền selectedCell.
   */
  cellKey: string | null;

  editor: Editor | null;

  /*
   * Style của selected cell.
   */
  cellStyle: CellStyle;

  updateCellStyle: (patch: Partial<CellStyle>) => void;

  zoom: number;
  setZoom: (zoom: number) => void;
}

export default function Toolbar({
  editing,
  cellKey,
  editor,
  cellStyle,
  updateCellStyle,
  zoom,
  setZoom,
}: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const { visibleGroups, overflowGroups, handleGroupResize, calculateGroups } =
    useToolbarOverflow();

  const {
    textStyle,

    toggleBold,
    toggleItalic,
    toggleStrike,

    setColor,
    setFontSize,
    setFontFamily,
  } = useToolbar({
    editing,
    cellKey,
    editor,
    cellStyle,
    updateCellStyle,
  });

  /**
   * Render group.
   */
  const renderGroup = useCallback(
    (group: (typeof GROUPS)[number], mode: ToolGroupMode = "toolbar") => {
      switch (group) {
        case "utility":
          return <UtilityGroup zoom={zoom} setZoom={setZoom} mode={mode} />;

        case "font":
          return (
            <FontGroup
              value={textStyle.fontFamily}
              onChange={setFontFamily}
              mode={mode}
            />
          );

        case "fontSize":
          return (
            <FontSizeGroup
              textStyle={textStyle}
              setFontSize={setFontSize}
              mode={mode}
            />
          );

        case "textStyle":
          return (
            <TextStyleGroup
              textStyle={textStyle}
              toggleBold={toggleBold}
              toggleItalic={toggleItalic}
              toggleStrike={toggleStrike}
              setColor={setColor}
              mode={mode}
            />
          );

        case "cellStyle":
          return (
            <CellStyleGroup
              cellStyle={cellStyle}
              updateCellStyle={updateCellStyle}
              mode={mode}
            />
          );

        case "alignment":
          return (
            <AlignmentGroup
              cellStyle={cellStyle}
              updateCellStyle={updateCellStyle}
              mode={mode}
            />
          );

        default:
          return null;
      }
    },
    [
      zoom,
      setZoom,

      textStyle,

      setFontFamily,
      setFontSize,

      toggleBold,
      toggleItalic,
      toggleStrike,

      setColor,

      cellStyle,
      updateCellStyle,
    ],
  );

  /**
   * Theo dõi width của toolbar.
   */
  useLayoutEffect(() => {
    const toolbar = toolbarRef.current;

    if (!toolbar) {
      return;
    }

    const update = () => {
      const style = window.getComputedStyle(toolbar);

      const paddingLeft = parseFloat(style.paddingLeft) || 0;

      const paddingRight = parseFloat(style.paddingRight) || 0;

      const availableWidth =
        toolbar.getBoundingClientRect().width - paddingLeft - paddingRight;

      calculateGroups(availableWidth, MORE_WIDTH);
    };

    update();

    const observer = new ResizeObserver(update);

    observer.observe(toolbar);

    return () => {
      observer.disconnect();
    };
  }, [calculateGroups]);

  return (
    <div className={cx("toolbar-wrapper")}>
      <div ref={toolbarRef} className={cx("toolbar")}>
        <div className={cx("toolbar__content")}>
          {visibleGroups.map((group, index) => (
            <Fragment key={group}>
              <ToolbarMeasureItem group={group} onResize={handleGroupResize}>
                {renderGroup(group, "toolbar")}
              </ToolbarMeasureItem>

              {index < visibleGroups.length - 1 && (
                <span className={cx("toolbar__divider")} aria-hidden="true" />
              )}
            </Fragment>
          ))}

          <ToolbarOverflow
            groups={overflowGroups}
            renderGroup={(group) => renderGroup(group, "overflow")}
          />
        </div>
      </div>
    </div>
  );
}
