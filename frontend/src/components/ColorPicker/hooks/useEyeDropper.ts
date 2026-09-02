import { useCallback } from "react";

interface EyeDropperResult {
  sRGBHex: string;
}

interface EyeDropperInstance {
  open: () => Promise<EyeDropperResult>;
}

interface EyeDropperConstructor {
  new (): EyeDropperInstance;
}

export function useEyeDropper() {
  const pickColor = useCallback(async (): Promise<string | null> => {
    const EyeDropperAPI = (
      window as typeof window & {
        EyeDropper?: EyeDropperConstructor;
      }
    ).EyeDropper;

    if (!EyeDropperAPI) {
      alert("Trình duyệt không hỗ trợ Color Picker");
      return null;
    }

    try {
      const eyeDropper = new EyeDropperAPI();
      const result = await eyeDropper.open();

      return result.sRGBHex;
    } catch {
      // Người dùng nhấn ESC
      return null;
    }
  }, []);

  return { pickColor };
}
