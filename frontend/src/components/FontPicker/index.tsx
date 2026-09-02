import { useEffect, useState } from "react";

import type { MouseEvent } from "react";

import classNames from "classnames/bind";

import { Icon } from "@iconify/react";

import { useClickOutside } from "@/hooks/useClickOutside";

import { FONT_FAMILIES } from "./constants";
import { useLoadFont } from "./hooks/useLoadFont";

import type { FontMetadataMap } from "./types";

import metadata from "@/fonts/metadata.json";

import styles from "./FontPicker.module.scss";

const cx = classNames.bind(styles);

interface FontPickerProps {
  value: string;
  onChange: (fontFamily: string) => void;
}

const MAX_RECENT_FONTS = 5;
const RECENT_FONTS_KEY = "rich-text-editor-recent-fonts";

const preventEditorBlur = (event: MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

const isValidFont = (font: string): boolean => {
  return FONT_FAMILIES.includes(font as (typeof FONT_FAMILIES)[number]);
};

const getFontSlug = (fontFamily: string): string => {
  return fontFamily
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/\+/g, "plus")
    .replace(/\s+/g, "-");
};

const getPreviewUrl = (fontFamily: string): string => {
  return `/fonts/${getFontSlug(fontFamily)}.svg`;
};

const getRecentFonts = (defaultFont: string): string[] => {
  try {
    const stored = localStorage.getItem(RECENT_FONTS_KEY);

    if (!stored) {
      return [defaultFont];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [defaultFont];
    }

    const fonts = parsed.filter(
      (font): font is string => typeof font === "string" && isValidFont(font),
    );

    if (!fonts.includes(defaultFont)) {
      fonts.unshift(defaultFont);
    }

    return fonts.slice(0, MAX_RECENT_FONTS);
  } catch {
    return [defaultFont];
  }
};

export default function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false);

  const [recentFonts, setRecentFonts] = useState<string[]>(() =>
    getRecentFonts(value),
  );

  const [loadingFont, setLoadingFont] = useState<string | null>(null);

  const containerRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const { loadFont } = useLoadFont();

  /**
   * Persist recent fonts.
   *
   * Không update recentFonts bằng effect.
   * Việc chọn font được xử lý trực tiếp
   * trong handleSelect.
   */
  useEffect(() => {
    localStorage.setItem(RECENT_FONTS_KEY, JSON.stringify(recentFonts));
  }, [recentFonts]);

  const handleToggle = () => {
    setOpen((previous) => !previous);
  };

  const handleSelect = async (fontFamily: string) => {
    if (fontFamily === value) {
      setOpen(false);
      return;
    }

    const font = (metadata as FontMetadataMap)[fontFamily];

    /**
     * Google Font:
     * load actual font lazily.
     *
     * System font:
     * không có metadata,
     * browser dùng font hệ thống.
     */
    if (font) {
      setLoadingFont(fontFamily);

      try {
        const loaded = await loadFont(font);

        if (!loaded) {
          return;
        }
      } finally {
        setLoadingFont(null);
      }
    }

    onChange(fontFamily);

    setRecentFonts((previous) =>
      [fontFamily, ...previous.filter((font) => font !== fontFamily)].slice(
        0,
        MAX_RECENT_FONTS,
      ),
    );

    setOpen(false);
  };

  const renderFontOption = (fontFamily: string) => {
    const active = fontFamily === value;
    const loading = loadingFont === fontFamily;
    const isGoogleFont = Boolean((metadata as FontMetadataMap)[fontFamily]);

    return (
      <button
        key={fontFamily}
        type="button"
        className={cx("font-picker__option", {
          "font-picker__option--active": active,
        })}
        onMouseDown={preventEditorBlur}
        onClick={() => handleSelect(fontFamily)}
        disabled={loading}
      >
        <span className={cx("font-picker__preview")}>
          {isGoogleFont ? (
            <img src={getPreviewUrl(fontFamily)} alt="" draggable={false} />
          ) : (
            <span
              style={{
                fontFamily,
              }}
            >
              {fontFamily}
            </span>
          )}
        </span>

        {active && (
          <Icon
            icon="material-symbols:check"
            className={cx("font-picker__check")}
          />
        )}
      </button>
    );
  };

  return (
    <div ref={containerRef} className={cx("font-picker")}>
      <button
        type="button"
        className={cx("font-picker__trigger", {
          "font-picker__trigger--active": open,
        })}
        onMouseDown={preventEditorBlur}
        onClick={handleToggle}
      >
        <span
          className={cx("font-picker__value")}
          style={{
            fontFamily: value,
          }}
        >
          {value}
        </span>

        <Icon
          icon="material-symbols:keyboard-arrow-down"
          className={cx("font-picker__arrow", {
            "font-picker__arrow--active": open,
          })}
        />
      </button>

      {open && (
        <div className={cx("font-picker__popover")}>
          <section className={cx("font-picker__section")}>
            <span className={cx("font-picker__section-title")}>Recent</span>

            {recentFonts.map(renderFontOption)}
          </section>

          <div className={cx("font-picker__divider")} />

          <div className={cx("font-picker__list")}>
            {FONT_FAMILIES.map(renderFontOption)}
          </div>
        </div>
      )}
    </div>
  );
}
