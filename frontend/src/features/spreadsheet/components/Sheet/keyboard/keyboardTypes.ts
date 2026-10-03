export type ArrowKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export type NavigationKey =
  | ArrowKey
  | "Enter"
  | "Tab"
  | "Home"
  | "End"
  | "PageUp"
  | "PageDown";

export type EditingKey = "Escape" | "Backspace" | "Delete";

export type ClipboardKey = "c" | "x" | "v";

export type HistoryKey = "z" | "y";

export type SelectionKey = "a" | ArrowKey;

export type ShortcutKey =
  | NavigationKey
  | EditingKey
  | ClipboardKey
  | HistoryKey
  | SelectionKey;

export type Modifier = "Mod" | "Shift" | "Alt";

export interface KeyboardShortcut {
  key: ShortcutKey;
  modifiers: readonly Modifier[];
}
