export const TextBackgroundColorItems = [
  {
    id: 1,
    name: "None",
  },
  {
    id: 2,
    name: "White",
  },
  {
    id: 3,
    name: "Black",
  },
] as const;

export const BACKGROUND_COLOR_CONFIGS = {
  None: null,
  White: { backgroundColor: "#ffffff", textColor: "#000000" },
  Black: { backgroundColor: "#000000", textColor: "#ffffff" },
} as const;

export type BackgroundColorName = keyof typeof BACKGROUND_COLOR_CONFIGS;
