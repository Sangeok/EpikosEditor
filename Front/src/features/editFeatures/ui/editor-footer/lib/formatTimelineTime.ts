/**
 * format seconds to "mm:ss.SSS"
 * @param seconds - seconds
 * @param options - optional formatting options
 * @returns "mm:ss.SSS" format string (always shows milliseconds)
 */
export function formatPlaybackTime(seconds: number, options?: { hideMillisIfZero?: boolean }): string {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00.000";
  }

  const totalMillis = Math.round(seconds * 1000);
  const minutes = Math.floor(totalMillis / 60000);
  const remaining = totalMillis % 60000;
  const secs = Math.floor(remaining / 1000);
  const millis = remaining % 1000;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  const SSS = String(millis).padStart(3, "0");

  if (options?.hideMillisIfZero && millis === 0) {
    return `${mm}:${ss}`;
  }

  return `${mm}:${ss}.${SSS}`;
}
