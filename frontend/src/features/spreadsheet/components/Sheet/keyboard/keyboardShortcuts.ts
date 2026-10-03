import type { KeyboardShortcut } from "./keyboardTypes";

export const SHORTCUTS = {
  // Navigation
  MOVE_UP: {
    key: "ArrowUp",
    modifiers: [],
  },

  MOVE_DOWN: {
    key: "ArrowDown",
    modifiers: [],
  },

  MOVE_LEFT: {
    key: "ArrowLeft",
    modifiers: [],
  },

  MOVE_RIGHT: {
    key: "ArrowRight",
    modifiers: [],
  },

  ENTER: {
    key: "Enter",
    modifiers: [],
  },

  TAB: {
    key: "Tab",
    modifiers: [],
  },

  HOME: {
    key: "Home",
    modifiers: [],
  },

  END: {
    key: "End",
    modifiers: [],
  },

  PAGE_UP: {
    key: "PageUp",
    modifiers: [],
  },

  PAGE_DOWN: {
    key: "PageDown",
    modifiers: [],
  },

  // Editing
  ESCAPE: {
    key: "Escape",
    modifiers: [],
  },

  BACKSPACE: {
    key: "Backspace",
    modifiers: [],
  },

  DELETE: {
    key: "Delete",
    modifiers: [],
  },

  // Clipboard
  COPY: {
    key: "c",
    modifiers: ["Mod"],
  },

  CUT: {
    key: "x",
    modifiers: ["Mod"],
  },

  PASTE: {
    key: "v",
    modifiers: ["Mod"],
  },

  // History
  UNDO: {
    key: "z",
    modifiers: ["Mod"],
  },

  REDO: {
    key: "z",
    modifiers: ["Mod", "Shift"],
  },

  // Selection
  SELECT_ALL: {
    key: "a",
    modifiers: ["Mod"],
  },

  SELECT_UP: {
    key: "ArrowUp",
    modifiers: ["Shift"],
  },

  SELECT_DOWN: {
    key: "ArrowDown",
    modifiers: ["Shift"],
  },

  SELECT_LEFT: {
    key: "ArrowLeft",
    modifiers: ["Shift"],
  },

  SELECT_RIGHT: {
    key: "ArrowRight",
    modifiers: ["Shift"],
  },

  // Ctrl + Arrow
  MOVE_REGION_UP: {
    key: "ArrowUp",
    modifiers: ["Mod"],
  },

  MOVE_REGION_DOWN: {
    key: "ArrowDown",
    modifiers: ["Mod"],
  },

  MOVE_REGION_LEFT: {
    key: "ArrowLeft",
    modifiers: ["Mod"],
  },

  MOVE_REGION_RIGHT: {
    key: "ArrowRight",
    modifiers: ["Mod"],
  },

  // Ctrl + Shift + Arrow
  SELECT_REGION_UP: {
    key: "ArrowUp",
    modifiers: ["Mod", "Shift"],
  },

  SELECT_REGION_DOWN: {
    key: "ArrowDown",
    modifiers: ["Mod", "Shift"],
  },

  SELECT_REGION_LEFT: {
    key: "ArrowLeft",
    modifiers: ["Mod", "Shift"],
  },

  SELECT_REGION_RIGHT: {
    key: "ArrowRight",
    modifiers: ["Mod", "Shift"],
  },
} as const satisfies Record<string, KeyboardShortcut>;
