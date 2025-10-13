export const MS_PER_SECOND = 1000;
export const TIME_DECIMALS = 3; // seconds precision to milliseconds

export const pixelsToTime = (pixels: number, pixelsPerSecond: number): number => {
  const time = pixels / pixelsPerSecond;
  return Math.round(time * MS_PER_SECOND) / MS_PER_SECOND;
};

export const timeToPixels = (time: number, pixelsPerSecond: number): number => {
  const pixels = time * pixelsPerSecond;
  return Math.round(pixels * MS_PER_SECOND) / MS_PER_SECOND;
};

export const roundTime = (time: number): number => {
  return Math.round(time * MS_PER_SECOND) / MS_PER_SECOND;
};

export const secToMs = (seconds: number): number => {
  return Math.round(seconds * MS_PER_SECOND);
};

export const msToSec = (milliseconds: number): number => {
  return Math.round(milliseconds) / MS_PER_SECOND;
};
