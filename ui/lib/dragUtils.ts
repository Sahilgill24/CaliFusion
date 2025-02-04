// utils/dragUtils.ts
export const getIndicators = (column: string): HTMLElement[] => {
  return Array.from(
    document.querySelectorAll(`[data-column="${column}"]`)
  ) as HTMLElement[];
};

export const getNearestIndicator = (
  e: React.DragEvent<HTMLDivElement>,
  indicators: HTMLElement[]
) => {
  const DISTANCE_OFFSET = 50;
  return indicators.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = e.clientY - (box.top + DISTANCE_OFFSET);
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    {
      offset: Number.NEGATIVE_INFINITY,
      element: indicators[indicators.length - 1],
    }
  );
};
