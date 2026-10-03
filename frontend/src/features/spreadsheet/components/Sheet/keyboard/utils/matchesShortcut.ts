import type { KeyboardShortcut } from "../keyboardTypes";

export function matchesShortcut(
  actual: KeyboardShortcut,
  expected: KeyboardShortcut,
): boolean {
  if (actual.key !== expected.key) {
    return false;
  }

  if (actual.modifiers.length !== expected.modifiers.length) {
    return false;
  }

  return expected.modifiers.every((modifier) =>
    actual.modifiers.includes(modifier),
  );
}
