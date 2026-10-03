import { Fragment, useCallback, useLayoutEffect, useRef } from "react";

import classNames from "classnames/bind";

import type { CellStyle, TextStyle } from "@/features/spreadsheet/types";

import {
  UtilityGroup,
  FontGroup,
  FontSizeGroup,
  TextStyleGroup,
  CellStyleGroup,
  AlignmentGroup,
} from "./groups";

import ToolbarMeasureItem from "./responsive/measure/ToolbarMeasureItem";
import ToolbarOverflow from "./responsive/overflow/ToolbarOverflow";

import {
  GROUPS,
  MORE_WIDTH,
  useToolbarOverflow,
} from "./responsive/overflow/useToolbarOverflow";

import type { ToolGroupMode } from "./base/ToolGroup";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

export interface ToolbarProps {
  textStyle: TextStyle;
  cellStyle: CellStyle;

  updateTextStyle: (patch: Partial<TextStyle>) => void;
  updateCellStyle: (patch: Partial<CellStyle>) => void;

  zoom: number;
  setZoom: (zoom: number) => void;
}

export default function Toolbar({
  textStyle,
  cellStyle,
  updateTextStyle,
  updateCellStyle,
  zoom,
  setZoom,
}: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const { visibleGroups, overflowGroups, handleGroupResize, calculateGroups } =
    useToolbarOverflow();

  const renderGroup = useCallback(
    (group: (typeof GROUPS)[number], mode: ToolGroupMode = "toolbar") => {
      switch (group) {
        case "utility":
          return <UtilityGroup zoom={zoom} setZoom={setZoom} mode={mode} />;

        case "font":
          return (
            <FontGroup
              textStyle={textStyle}
              updateTextStyle={updateTextStyle}
              mode={mode}
            />
          );

        case "fontSize":
          return (
            <FontSizeGroup
              textStyle={textStyle}
              updateTextStyle={updateTextStyle}
              mode={mode}
            />
          );

        case "textStyle":
          return (
            <TextStyleGroup
              textStyle={textStyle}
              updateTextStyle={updateTextStyle}
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
    [zoom, setZoom, textStyle, updateTextStyle, cellStyle, updateCellStyle],
  );

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
