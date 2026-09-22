export const useFontSize = (
  updateCellStyle: (patch: { fontSize: number }) => void,
) => {
  const onFontSizeChange = (fontSize: number) => {
    updateCellStyle({
      fontSize,
    });
  };

  return {
    onFontSizeChange,
  };
};
