import type { CellStyle } from "@/types/cell-style";

export type SyncStyle = Pick<
  CellStyle,
  "bold" | "italic" | "strike" | "fontFamily" | "fontSize" | "color"
>;

export const STYLE_SYNC_CONFIG = {
  bold: "boolean",
  italic: "boolean",
  strike: "boolean",

  fontFamily: "value",
  fontSize: "value",
  color: "value",
} as const;

export type SyncStyleKey = keyof SyncStyle;

export type BooleanStyleKey = {
  [K in SyncStyleKey]: SyncStyle[K] extends boolean ? K : never;
}[SyncStyleKey];

export type ValueStyleKey = {
  [K in SyncStyleKey]: SyncStyle[K] extends string | number | null ? K : never;
}[SyncStyleKey];
