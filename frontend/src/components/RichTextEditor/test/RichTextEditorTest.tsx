import RichTextEditor from "../index";

import {
  useRichTextEditor,
  useTextStyle,
  useBold,
  useItalic,
  useStrike,
  useColor,
  useFontSize,
  useFontFamily,
} from "@/components/RichTextEditor/hooks";

import styles from "./RichTextEditorTest.module.scss";

const FONT_FAMILIES = [
  "Arial",
  "Calibri",
  "Times New Roman",
  "Georgia",
  "Verdana",
] as const;

const FONT_SIZES = [10, 11, 12, 14, 16, 18, 20, 24, 28, 32] as const;

const RichTextEditorTest = () => {
  const editor = useRichTextEditor();

  const textStyle = useTextStyle(editor);

  const { onBoldClick } = useBold(editor);
  const { onItalicClick } = useItalic(editor);
  const { onStrikeClick } = useStrike(editor);

  const { onFontSizeChange } = useFontSize(editor);
  const { onColorChange } = useColor(editor);
  const { onFontFamilyChange } = useFontFamily(editor);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        {/* Font family */}
        <div className={styles.group}>
          <select
            className={styles.select}
            value={textStyle.fontFamily}
            onChange={(event) => {
              onFontFamilyChange(event.target.value);
            }}
          >
            {FONT_FAMILIES.map((fontFamily) => (
              <option key={fontFamily} value={fontFamily}>
                {fontFamily}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.divider} />

        {/* Font size */}
        <div className={styles.group}>
          <select
            className={styles.select}
            value={textStyle.fontSize}
            onChange={(event) => {
              onFontSizeChange(Number(event.target.value));
            }}
          >
            {FONT_SIZES.map((fontSize) => (
              <option key={fontSize} value={fontSize}>
                {fontSize}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.divider} />

        {/* Text style */}
        <div className={styles.group}>
          <button
            type="button"
            className={`${styles.button} ${
              textStyle.bold ? styles.active : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={onBoldClick}
            aria-pressed={textStyle.bold}
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            className={`${styles.button} ${
              textStyle.italic ? styles.active : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={onItalicClick}
            aria-pressed={textStyle.italic}
          >
            <em>I</em>
          </button>

          <button
            type="button"
            className={`${styles.button} ${
              textStyle.strike ? styles.active : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={onStrikeClick}
            aria-pressed={textStyle.strike}
          >
            <s>S</s>
          </button>
        </div>

        <div className={styles.divider} />

        {/* Text color */}
        <div className={styles.group}>
          <label className={styles.colorPicker}>
            <span className={styles.colorIcon}>A</span>

            <input
              type="color"
              value={textStyle.color ?? "#000000"}
              onChange={(event) => {
                onColorChange(event.target.value);
              }}
              aria-label="Text color"
            />
          </label>
        </div>
      </div>

      <div className={styles.editorWrapper}>
        <RichTextEditor editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditorTest;
