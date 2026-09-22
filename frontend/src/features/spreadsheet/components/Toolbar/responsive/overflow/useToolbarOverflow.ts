import { useCallback, useState } from "react";

export const GROUPS = [
  "utility",
  "font",
  "fontSize",
  "textStyle",
  "cellStyle",
  "alignment",
] as const;

export type GroupName = (typeof GROUPS)[number];

export type GroupWidths = Partial<Record<GroupName, number>>;

export const MORE_WIDTH = 36;

const GROUP_GAP = 8;

export function useToolbarOverflow() {
  const [groupWidths, setGroupWidths] = useState<GroupWidths>({});

  const [visibleGroups, setVisibleGroups] = useState<GroupName[]>([...GROUPS]);

  const [overflowGroups, setOverflowGroups] = useState<GroupName[]>([]);

  /**
   * Lưu width thực tế của group.
   */
  const handleGroupResize = useCallback((group: GroupName, width: number) => {
    setGroupWidths((current) => {
      const previous = current[group];

      /**
       * Tránh render lại nếu width
       * thực tế không đổi.
       */
      if (previous != null && Math.abs(previous - width) < 0.5) {
        return current;
      }

      return {
        ...current,
        [group]: width,
      };
    });
  }, []);

  /**
   * Kiểm tra 2 array group có giống nhau.
   */
  const isSameGroups = (a: GroupName[], b: GroupName[]) => {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((group, index) => group === b[index]);
  };

  /**
   * Calculate visible / overflow groups.
   */
  const calculateGroups = useCallback(
    (availableWidth: number, moreWidth: number) => {
      /**
       * Chưa đo đủ thì chưa calculate.
       */
      if (!GROUPS.every((group) => groupWidths[group] != null)) {
        return;
      }

      /**
       * Tổng width của toàn bộ groups.
       */
      const totalWidth = GROUPS.reduce((total, group, index) => {
        const width = groupWidths[group]!;

        return total + width + (index > 0 ? GROUP_GAP : 0);
      }, 0);

      /**
       * Nếu tất cả vừa:
       *
       * Không cần More.
       */
      if (totalWidth <= availableWidth) {
        const nextVisible = [...GROUPS];

        if (!isSameGroups(visibleGroups, nextVisible)) {
          setVisibleGroups(nextVisible);
        }

        if (overflowGroups.length > 0) {
          setOverflowGroups([]);
        }

        return;
      }

      /**
       * Có overflow.
       *
       * Chừa:
       *
       * More button
       * +
       * gap trước More
       */
      const contentWidth = Math.max(0, availableWidth - moreWidth - GROUP_GAP);

      const nextVisible: GroupName[] = [];

      const nextOverflow: GroupName[] = [];

      let usedWidth = 0;

      for (const group of GROUPS) {
        const width = groupWidths[group]!;

        const nextWidth =
          nextVisible.length === 0 ? width : usedWidth + GROUP_GAP + width;

        if (nextWidth <= contentWidth) {
          nextVisible.push(group);

          usedWidth = nextWidth;
        } else {
          nextOverflow.push(group);
        }
      }

      if (!isSameGroups(visibleGroups, nextVisible)) {
        setVisibleGroups(nextVisible);
      }

      if (!isSameGroups(overflowGroups, nextOverflow)) {
        setOverflowGroups(nextOverflow);
      }
    },
    [groupWidths, visibleGroups, overflowGroups],
  );

  return {
    groupWidths,
    visibleGroups,
    overflowGroups,
    handleGroupResize,
    calculateGroups,
  };
}
