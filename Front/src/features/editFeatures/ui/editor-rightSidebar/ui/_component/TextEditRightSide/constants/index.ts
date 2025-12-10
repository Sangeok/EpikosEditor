import { FontStyleValue } from "../model/types";

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
  {
    id: 4,
    name: "Inherit-White-Text",
  },
  {
    id: 5,
    name: "Inherit-Black-Text",
  },
] as const;

export const BACKGROUND_COLOR_CONFIGS = {
  None: null,
  White: { backgroundColor: "#ffffff", textColor: "#000000" },
  Black: { backgroundColor: "#000000", textColor: "#ffffff" },
  "Inherit-White-Text": { backgroundColor: "inherit", textColor: "#ffffff" },
  "Inherit-Black-Text": { backgroundColor: "inherit", textColor: "#000000" },
} as const;

export type BackgroundColorName = keyof typeof BACKGROUND_COLOR_CONFIGS;

// ======================
// Text Shadow 관련 상수
// ======================

export const TextShadowItems = [
  { id: 1, name: "None" },
  { id: 2, name: "Soft Shadow" },
  { id: 3, name: "Strong Shadow" },
  { id: 4, name: "Subtitle Default" },
] as const;

export const TEXT_SHADOW_CONFIGS = {
  None: null,
  "Soft Shadow": {
    offsetX: 0,
    offsetY: 0,
    blur: { min: 0, max: 6.5 }, // 예시 값과 비슷한 최대 blur
    alpha: { min: 0, max: 0.5 }, // 부드러운 느낌
    rgb: { r: 8, g: 8, b: 8 },
  },
  "Strong Shadow": {
    offsetX: 0,
    offsetY: 0,
    blur: { min: 2, max: 10 },
    alpha: { min: 0.3, max: 0.82 }, // 요구 예시의 0.82까지
    rgb: { r: 8, g: 8, b: 8 },
  },
  "Subtitle Default": {
    // 2025-12-10 기준, 밝은/흰 배경에서도 자막 가독성을 높이기 위한 기본 스타일
    offsetX: 0,
    offsetY: 0,
    // intensity 100일 때 대략 8px 정도의 강한 글로우
    blur: { min: 2, max: 8 },
    // 거의 검정에 가까운 그림자, 흰/밝은 배경에서도 윤곽이 또렷하게 보이도록
    alpha: { min: 0.4, max: 0.85 },
    rgb: { r: 0, g: 0, b: 0 },
  },
  "Subtitle for white": {
    // 흰/밝은 배경 위에서 사용할 강한 다크 글로우
    // intensity 100 → 0 0 6.5px rgba(8, 8, 8, 0.82)
    offsetX: 0,
    offsetY: 0,
    blur: { min: 2, max: 6.5 },
    alpha: { min: 0.3, max: 0.82 },
    rgb: { r: 8, g: 8, b: 8 },
  },
} as const;

export type TextShadowName = keyof typeof TEXT_SHADOW_CONFIGS;

export const FONT_STYLE_ITEMS = ["Normal", "Italic"] as const;

export const FONT_STYLE_LABEL_BY_VALUE: Record<FontStyleValue, string> = {
  normal: "Normal",
  italic: "Italic",
};

export const FONT_WEIGHT_ITEMS = ["Normal (400)", "Medium (500)", "Semi Bold (600)", "Bold (700)"] as const;

export const FONT_WEIGHT_LABEL_BY_VALUE: Record<number, string> = {
  400: "Normal (400)",
  500: "Medium (500)",
  600: "Semi Bold (600)",
  700: "Bold (700)",
};
