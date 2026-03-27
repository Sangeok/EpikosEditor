import { generateScript } from "@/shared/lib/AiModel";
import { ModelJsonParseError, sendMessageAndParseJson } from "@/shared/lib/modelResponseUtils";
import { NextResponse } from "next/server";

const SCRIPT_PROMPT = `
You are a subtitle translator operating in STRICT STRUCTURE-PRESERVATION mode.

TASK
- Input is an SRT block between <SRT_START> and <SRT_END>.
- Translate ONLY Hangul (Korean characters) that appear on subtitle text lines into {targetLanguage}.
- Do not create or remove any lines.

LINE TYPES (guidelines, not literal execution):
- Index line: ^\\d+$
- Timestamp line: ^\\d{2}:\\d{2}:\\d{2},\\d{3}\\s-->\\s\\d{2}:\\d{2}:\\d{2},\\d{3}$
- Blank line: ^\\s*$
- Subtitle text line: anything else.

HARD CONSTRAINTS
1) Echo the entire input EXACTLY. Modify ONLY subtitle text lines by replacing Hangul with its translation into {targetLanguage}.
2) Preserve all indices, timestamps, arrows ("-->"), spaces, blank lines, and line breaks EXACTLY.
3) Do NOT merge, split, delete, reorder, or renumber any lines or blocks.
4) Do NOT change any ASCII characters, numerals, punctuation, or spacing that already exist on a line.
5) If a text line has no Hangul, copy it verbatim.
6) Keep the total line count and line positions IDENTICAL to input.
7) Output must be VALID JSON ONLY (no prose, no markdown fences, no explanations).

EXAMPLE
INPUT
<SRT_START>
1
00:00:01,000 --> 00:00:03,000
안녕하세요.

2
00:00:03,500 --> 00:00:05,000
반갑습니다!
<SRT_END>

OUTPUT (JSON ONLY)
{ "translatedText": "1\\n00:00:01,000 --> 00:00:03,000\\nHello.\\n\\n2\\n00:00:03,500 --> 00:00:05,000\\nNice to meet you!\\n" }

NOW TRANSLATE THE FOLLOWING STRICTLY UNDER THE SAME RULES:
<SRT_START>
{text}
<SRT_END>

Return ONLY valid JSON with this exact schema:
{ "translatedText": "<the input with ONLY Hangul on subtitle text lines translated into {targetLanguage}, preserving every original newline and space>" }
`;

const JSON_RETRY_INSTRUCTION = `
IMPORTANT:
- Return ONLY valid JSON.
- Do not include markdown code fences or any extra text.
- Keep all original line breaks exactly as required.
`;

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    const PROMPT = SCRIPT_PROMPT.replace("{text}", text).replaceAll("{targetLanguage}", targetLanguage);

    console.log("PROMPT");
    console.log(PROMPT);

    const { parsed } = await sendMessageAndParseJson<{ translatedText?: string }>(generateScript, PROMPT, {
      maxAttempts: 2,
      retryInstruction: JSON_RETRY_INSTRUCTION,
    });

    return NextResponse.json(parsed);
  } catch (err) {
    if (err instanceof ModelJsonParseError) {
      console.error("Failed to parse JSON response from model", err.parseError);
      return NextResponse.json({ error: "Invalid JSON from model", raw: err.raw, attempts: err.attempts }, { status: 500 });
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to translate captions" },
      { status: 500 },
    );
  }
}
