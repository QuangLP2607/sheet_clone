import { create } from "zustand";

interface ViewportState {
  zoom: number;

  setZoom: (zoom: number) => void;
}

const MIN_ZOOM = 25;
const MAX_ZOOM = 200;

export const useViewportStore = create<ViewportState>((set) => ({
  zoom: 100,

  setZoom: (zoom) => {
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

    set({
      zoom: nextZoom,
    });
  },
}));
