/**
 * Player configuration constants
 * Central source of truth for all player-related dimensions and settings
 */
export const PLAYER_CONFIG = {
  // Composition dimensions (actual video resolution)
  COMPOSITION_WIDTH: 1080,
  COMPOSITION_HEIGHT: 1920,

  // Display dimensions (viewer size in pixels)
  PLAYER_DISPLAY_WIDTH: 225,

  /**
   * Calculated scale factor for X-axis
   * Converts viewer coordinates to composition coordinates
   */
  get SCALE_X(): number {
    return this.COMPOSITION_WIDTH / this.PLAYER_DISPLAY_WIDTH;
  },

  /**
   * Calculated scale factor for Y-axis
   * Converts viewer coordinates to composition coordinates
   */
  get SCALE_Y(): number {
    const aspectRatio = this.COMPOSITION_HEIGHT / this.COMPOSITION_WIDTH;
    return this.COMPOSITION_HEIGHT / (this.PLAYER_DISPLAY_WIDTH * aspectRatio);
  },

  /**
   * Calculated display height based on aspect ratio
   */
  get PLAYER_DISPLAY_HEIGHT(): number {
    const aspectRatio = this.COMPOSITION_HEIGHT / this.COMPOSITION_WIDTH;
    return this.PLAYER_DISPLAY_WIDTH * aspectRatio;
  },
} as const;

// Type-safe exports
export type PlayerConfig = typeof PLAYER_CONFIG;
