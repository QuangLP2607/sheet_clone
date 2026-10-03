export type TextAlign = "left" | "center" | "right";

export interface TextStyle {
  bold: boolean;
  italic: boolean;
  strike: boolean;
  fontFamily: string;
  fontSize: number;
  color: string;
  textAlign: TextAlign;
}
