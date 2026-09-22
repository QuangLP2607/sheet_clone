import type { Editor } from "@tiptap/react";
import type { Node as PMNode } from "@tiptap/pm/model";

import {
  STYLE_SYNC_CONFIG,
  type SyncStyle,
  type SyncStyleKey,
} from "./styleSyncConfig";

const getTextNodes = (editor: Editor): PMNode[] => {
  const nodes: PMNode[] = [];

  editor.state.doc.nodesBetween(0, editor.state.doc.content.size, (node) => {
    if (node.isText) {
      nodes.push(node);
    }
  });

  return nodes;
};

const getMark = (node: PMNode, name: string) => {
  return node.marks.find((mark) => mark.type.name === name);
};

const getCommonValue = <T>(values: T[]): T | null => {
  if (values.length === 0) {
    return null;
  }

  const first = values[0];

  return values.every((value) => value === first) ? first : null;
};

const normalizeFontSize = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const match = value.match(/[\d.]+/);

  if (!match) {
    return null;
  }

  const size = Number(match[0]);

  return Number.isFinite(size) ? size : null;
};

const getValue = (node: PMNode, key: SyncStyleKey): string | number | null => {
  const mark = getMark(node, "textStyle");

  const value = mark?.attrs[key];

  if (key === "fontSize") {
    return normalizeFontSize(value);
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
};

export const isFullSelection = (editor: Editor): boolean => {
  const { from, to } = editor.state.selection;

  if (from === to) {
    return false;
  }

  let firstTextPos: number | null = null;

  let lastTextEnd: number | null = null;

  editor.state.doc.nodesBetween(
    0,
    editor.state.doc.content.size,
    (node, pos) => {
      if (!node.isText) {
        return;
      }

      if (firstTextPos === null) {
        firstTextPos = pos;
      }

      lastTextEnd = pos + node.nodeSize;
    },
  );

  if (firstTextPos === null || lastTextEnd === null) {
    return false;
  }

  return from <= firstTextPos && to >= lastTextEnd;
};

export const readCellStyle = (editor: Editor): Partial<SyncStyle> => {
  const textNodes = getTextNodes(editor);

  if (textNodes.length === 0) {
    return {};
  }

  const result: Partial<SyncStyle> = {};

  /*
   * Bold
   */
  if (STYLE_SYNC_CONFIG.bold === "boolean") {
    const value = getCommonValue(
      textNodes.map((node) => Boolean(getMark(node, "bold"))),
    );

    if (value !== null) {
      result.bold = value;
    }
  }

  /*
   * Italic
   */
  if (STYLE_SYNC_CONFIG.italic === "boolean") {
    const value = getCommonValue(
      textNodes.map((node) => Boolean(getMark(node, "italic"))),
    );

    if (value !== null) {
      result.italic = value;
    }
  }

  /*
   * Strike
   */
  if (STYLE_SYNC_CONFIG.strike === "boolean") {
    const value = getCommonValue(
      textNodes.map((node) => Boolean(getMark(node, "strike"))),
    );

    if (value !== null) {
      result.strike = value;
    }
  }

  /*
   * Font family
   */
  if (STYLE_SYNC_CONFIG.fontFamily === "value") {
    const value = getCommonValue(
      textNodes.map((node) => getValue(node, "fontFamily")),
    );

    if (value !== null) {
      result.fontFamily = typeof value === "string" ? value : null;
    }
  }

  /*
   * Font size
   */
  if (STYLE_SYNC_CONFIG.fontSize === "value") {
    const value = getCommonValue(
      textNodes.map((node) => getValue(node, "fontSize")),
    );

    if (typeof value === "number") {
      result.fontSize = value;
    }
  }

  /*
   * Color
   */
  if (STYLE_SYNC_CONFIG.color === "value") {
    const value = getCommonValue(
      textNodes.map((node) => getValue(node, "color")),
    );

    if (typeof value === "string") {
      result.color = value;
    }
  }

  return result;
};
