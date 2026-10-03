export type BorderStyle = "solid" | "dashed" | "dotted" | "double";

export type BorderSide = "top" | "right" | "bottom" | "left";

export type HorizontalAlign = "left" | "center" | "right";

export type VerticalAlign = "top" | "middle" | "bottom";

export type TextWrapping = "overflow" | "wrap" | "clip";

export type TextRotation =
  | "none"
  | "angledown"
  | "angleup"
  | "rotate-up"
  | "rotate-down"
  | "vertical";

export interface CellStyle {
  fillColor: string;
  horizontalAlign: HorizontalAlign;
  verticalAlign: VerticalAlign;
  textWrapping: TextWrapping;
  textRotation: TextRotation;
}
