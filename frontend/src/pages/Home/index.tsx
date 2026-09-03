import classNames from "classnames/bind";

import Toolbar from "@/components/Toolbar";
import RichTextEditor from "@/components/RichTextEditor";
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

import styles from "./home.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
  const editor = useRichTextEditor();

  const textStyle = useTextStyle(editor);

  const { onBoldClick } = useBold(editor);
  const { onItalicClick } = useItalic(editor);
  const { onStrikeClick } = useStrike(editor);

  const { onColorChange } = useColor(editor);
  const { onFontSizeChange } = useFontSize(editor);
  const { onFontFamilyChange } = useFontFamily(editor);

  const setColor = (color: string | null) => {
    if (color) {
      onColorChange(color);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <Toolbar
        textStyle={textStyle}
        toggleBold={onBoldClick}
        toggleItalic={onItalicClick}
        toggleStrike={onStrikeClick}
        setColor={setColor}
        setFontSize={onFontSizeChange}
        setFontFamily={onFontFamilyChange}
      />

      <RichTextEditor editor={editor} />
    </div>
  );
}
