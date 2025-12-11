import { TextElement } from "@/entities/media/types";
import srtParser2 from "srt-parser-2";

export interface SRTEntry {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
}

export interface ParsedSRTEntry {
  id: string;
  startSeconds: number;
  endSeconds: number;
  duration: number;
  text: string;
}

/**
 * Parse SRT timestamp string to seconds
 * Format: "00:00:20,000" -> 20.0
 */
function parseTimeToSeconds(timeString: string): number {
  const [time, milliseconds] = timeString.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const ms = parseInt(milliseconds) / 1000;

  return hours * 3600 + minutes * 60 + seconds + ms;
}

/**
 * Parse SRT file content and return structured data
 */
export function parseSRTContent(srtContent: string): ParsedSRTEntry[] {
  const parser = new srtParser2();
  const srtArray = parser.fromSrt(srtContent);

  return srtArray.map((entry: SRTEntry) => {
    const startSeconds = parseTimeToSeconds(entry.startTime);
    const endSeconds = parseTimeToSeconds(entry.endTime);

    return {
      id: entry.id,
      startSeconds,
      endSeconds,
      duration: endSeconds - startSeconds,
      text: entry.text.replace(/\n/g, " "), // Convert line breaks to spaces
    };
  });
}

/**
 * Convert parsed SRT entries to TextElement format
 */
export function convertSRTToTextElements(parsedEntries: ParsedSRTEntry[]): TextElement[] {
  return parsedEntries.map((entry, index) => ({
    id: `srt-${Date.now()}-${index}`,
    type: "text",
    startTime: entry.startSeconds,
    endTime: entry.endSeconds,
    duration: entry.duration,
    text: entry.text,

    positionX: 540, // Center horizontally
    positionY: 950, // Bottom area for subtitles
    maxWidth: "90%",
    width: 900,
    height: 50,
    whiteSpace: "pre-wrap",

    fontSize: 70,
    font: "Arial",
    textColor: "#ffffff",

    backgroundColor: "#000000",
    backgroundOpacity: 0.0,

    lineHeight: 1.3,
    fontWeight: 400,
    letterSpacing: 0.02,

    textShadow: "0px 0px 40px rgba(0, 0, 0, 0.95)",
    fontStyle: "italic",

    animation: "none",
    origin: "create-init",
  }));
}

/**
 * Read file content as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as text"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
