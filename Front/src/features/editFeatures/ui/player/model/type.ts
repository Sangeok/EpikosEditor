export interface ImageBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  height: number;
}

export type EdgeKey = "left" | "right" | "top" | "bottom";

export interface EdgeInfo {
  key: EdgeKey;
  distance: number;
  position: number;
}
