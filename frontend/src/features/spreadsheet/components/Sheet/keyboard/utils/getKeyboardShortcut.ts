import type {
  ArrowKey,
  EditingKey,
  HistoryKey,
  NavigationKey,
  SelectionKey,
  ShortcutKey,
} from "../keyboardTypes";

import type { Modifier, KeyboardShortcut } from "../keyboardTypes";

function isArrowKey(key: string): key is ArrowKey {
  return (
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    key === "ArrowLeft" ||
    key === "ArrowRight"
  );
}

function isNavigationKey(key: string): key is NavigationKey {
  return (
    isArrowKey(key) ||
    key === "Enter" ||
    key === "Tab" ||
    key === "Home" ||
    key === "End" ||
    key === "PageUp" ||
    key === "PageDown"
  );
}

function isEditingKey(key: string): key is EditingKey {
  return key === "Escape" || key === "Backspace" || key === "Delete";
}

function isClipboardKey(key: string): boolean {
  return key === "c" || key === "x" || key === "v";
}

function isHistoryKey(key: string): key is HistoryKey {
  return key === "z" || key === "y";
}

function isSelectionKey(key: string): key is SelectionKey {
  return key === "a" || isArrowKey(key);
}

function isShortcutKey(key: string): key is ShortcutKey {
  return (
    isNavigationKey(key) ||
    isEditingKey(key) ||
    isClipboardKey(key) ||
    isHistoryKey(key) ||
    isSelectionKey(key)
  );
}

function getModifiers(event: KeyboardEvent): Modifier[] {
  const modifiers: Modifier[] = [];

  if (event.ctrlKey || event.metaKey) {
    modifiers.push("Mod");
  }

  if (event.shiftKey) {
    modifiers.push("Shift");
  }

  if (event.altKey) {
    modifiers.push("Alt");
  }

  return modifiers;
}

export function getKeyboardShortcut(
  event: KeyboardEvent,
): KeyboardShortcut | null {
  if (!isShortcutKey(event.key)) {
    return null;
  }

  return {
    key: event.key,
    modifiers: getModifiers(event),
  };
}
