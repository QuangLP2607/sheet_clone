export type BorderStyle = "solid" | "dashed" | "dotted" | "double";

export type BorderSide = "top" | "right" | "bottom" | "left";

export type TextWrapping = "overflow" | "wrap" | "clip";

export interface CellStyle {
  bold: boolean;
  italic: boolean;
  strike: boolean;

  fontFamily: string | null;
  fontSize: number;
  color: string;

  fillColor: string | null;

  horizontalAlign: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
  textWrapping: TextWrapping;
}
