import type { TextRun } from "./text-run";
import type { TextStyle } from "./text-style";

export interface RichText {
  defaultStyle: TextStyle;
  runs: TextRun[];
}
