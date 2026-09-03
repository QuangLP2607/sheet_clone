import { useCallback, useEffect, useRef, useState } from "react";

export const GROUPS = [
  "utility",
  "font",
  "fontSize",
  "textStyle",
  "cellStyle",
  "alignment",
] as const;

export type GroupName = (typeof GROUPS)[number];

const MORE_WIDTH = 36;

export function useToolbarOverflow() {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const measureRefs = useRef<Partial<Record<GroupName, HTMLDivElement | null>>>(
    {},
  );

  const [visibleGroups, setVisibleGroups] = useState<GroupName[]>([...GROUPS]);

  const [overflowGroups, setOverflowGroups] = useState<GroupName[]>([]);

  const setMeasureRef = useCallback(
    (group: GroupName) => (element: HTMLDivElement | null) => {
      measureRefs.current[group] = element;
    },
    [],
  );

  const calculateGroups = useCallback(() => {
    const toolbar = toolbarRef.current;

    if (!toolbar) {
      return;
    }

    const toolbarWidth = toolbar.clientWidth;

    if (toolbarWidth <= 0) {
      return;
    }

    const widths = {} as Record<GroupName, number>;

    for (const group of GROUPS) {
      const element = measureRefs.current[group];

      if (!element) {
        return;
      }

      widths[group] = element.getBoundingClientRect().width;
    }

    const totalWidth = GROUPS.reduce(
      (total, group) => total + widths[group],
      0,
    );

    /*
     * Tất cả group đều vừa.
     */
    if (totalWidth <= toolbarWidth) {
      setVisibleGroups((current) => {
        if (
          current.length === GROUPS.length &&
          current.every((group, index) => group === GROUPS[index])
        ) {
          return current;
        }

        return [...GROUPS];
      });

      setOverflowGroups((current) => (current.length === 0 ? current : []));

      return;
    }

    /*
     * Không đủ chỗ.
     *
     * Chừa:
     * - 32px cho button More
     * - 4px margin-left của More
     */
    const availableWidth = Math.max(0, toolbarWidth - MORE_WIDTH);

    const nextVisible: GroupName[] = [];
    const nextOverflow: GroupName[] = [];

    let usedWidth = 0;

    for (const group of GROUPS) {
      const width = widths[group];

      if (usedWidth + width <= availableWidth) {
        nextVisible.push(group);
        usedWidth += width;
      } else {
        nextOverflow.push(group);
      }
    }

    setVisibleGroups((current) => {
      if (
        current.length === nextVisible.length &&
        current.every((group, index) => group === nextVisible[index])
      ) {
        return current;
      }

      return nextVisible;
    });

    setOverflowGroups((current) => {
      if (
        current.length === nextOverflow.length &&
        current.every((group, index) => group === nextOverflow[index])
      ) {
        return current;
      }

      return nextOverflow;
    });
  }, []);

  useEffect(() => {
    const toolbar = toolbarRef.current;

    if (!toolbar) {
      return;
    }

    const observer = new ResizeObserver(() => {
      calculateGroups();
    });

    observer.observe(toolbar);

    const frame = requestAnimationFrame(() => {
      calculateGroups();
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [calculateGroups]);

  return {
    toolbarRef,
    visibleGroups,
    overflowGroups,
    setMeasureRef,
  };
}
