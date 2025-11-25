export const ImageEffectMenuItems = {
  ImageIn: [
    {
      id: 1,
      name: "fadeIn",
    },
  ],
  ImageOut: [
    {
      id: 1,
      name: "fadeOut",
    },
  ],
  Zoom: [
    {
      id: 1,
      name: "Zoom In",
    },
    {
      id: 2,
      name: "Zoom Out",
    },
    {
      id: 3,
      name: "none",
    },
  ],
} as const;

export const DEFAULT_FADE_DURATION = 0.5; // fade in/out duration
export const DEFAULT_ZOOM_DURATION = 20.0; // zoom in/out duration
