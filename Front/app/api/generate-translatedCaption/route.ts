import { generateScript } from "@/shared/lib/AiModel";
import { NextResponse } from "next/server";

function extractJsonString(text: string): string {
  if (!text) return text;
  const trimmed = text.trim();
  const codeBlockMatch = trimmed.match(/```(?:json|JSON)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  const anyBlockMatch = trimmed.match(/```\s*([\s\S]*?)\s*```/);
  if (anyBlockMatch) {
    return anyBlockMatch[1].trim();
  }
  return trimmed;
}

function safeParseJson(text: string): any {
  const stripped = extractJsonString(text);
  try {
    return JSON.parse(stripped);
  } catch (e) {
    const first = stripped.indexOf("{");
    const last = stripped.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      const candidate = stripped.slice(first, last + 1).trim();
      try {
        return JSON.parse(candidate);
      } catch (_) {
        // fall-through
      }
    }
    throw e;
  }
}

const SCRIPT_PROMPT = `
You are a professional subtitle translator. STRICT STRUCTURE PRESERVATION.

IDENTIFICATION (use as rules, not as regex execution):
- Index line: ^\\d+$
- Timestamp line: ^\\d{2}:\\d{2}:\\d{2},\\d{3}\\s-->\\s\\d{2}:\\d{2}:\\d{2},\\d{3}$
- Blank line: ^\\s*$
- Subtitle text line: anything else.

MANDATORY RULES
1) Copy the entire input EXACTLY. Then replace ONLY Korean characters on subtitle text lines with {targetLanguage}. Do not modify numerals, ASCII, punctuation, spacing.
2) Keep indices, timestamps, arrows ("-->"), blank lines, and line breaks EXACTLY as they are.
3) Do NOT merge, split, delete, re-order, or renumber any lines or blocks.
4) Never move or insert timestamps inside text lines; timestamps remain on their own lines only.
5) The output must have the SAME number of lines and the SAME line positions as the input.
6) If a line has no Korean, copy it verbatim.
7) If unsure, copy the original line unchanged rather than altering structure.

INPUT (between tags; do not include the tags in output)
<SRT_START>
{text}
<SRT_END>

OUTPUT
Return ONLY valid JSON (no extra text or fences) with this exact schema:
{ "translatedText": "<the input with ONLY Korean text lines translated into {targetLanguage}, preserving every original newline and space>" }
Ensure JSON validity and that "translatedText" preserves identical line count and order as the input.
`;

export async function POST(req: Request) {
  const { text, targetLanguage } = await req.json();

  const PROMPT = SCRIPT_PROMPT.replace("{text}", text).replace("{targetLanguage}", targetLanguage);

  console.log("PROMPT");
  console.log(PROMPT);

  const result = await generateScript.sendMessage(PROMPT);

  const response = result?.response?.text();

  console.log("response");
  console.log(response);

  try {
    const parsed = safeParseJson(response as unknown as string);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Failed to parse JSON response from model", err);
    return NextResponse.json({ error: "Invalid JSON from model", raw: response }, { status: 500 });
  }
}
