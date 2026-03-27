import { generateScript } from "@/shared/lib/AiModel";
import { ModelJsonParseError, sendMessageAndParseJson } from "@/shared/lib/modelResponseUtils";
import { GenLongFormScriptPrompt, GenShortFormScriptPrompt } from "@/shared/lib/prompt/promptRegistry";
import { NextResponse } from "next/server";

const JSON_RETRY_INSTRUCTION = `
IMPORTANT:
- Return ONLY valid JSON (no markdown, no comments, no extra text).
- Match the required schema exactly.
- Do not repeat lines or loop text.
`;

export async function POST(req: Request) {
  try {
    const { topic, language, topicDetail, videoFormType } = await req.json();
    const detail = topicDetail ?? "";

    let prompt;
    if (videoFormType === "shortForm") {
      prompt = GenShortFormScriptPrompt(topic, language, detail);
    } else {
      prompt = GenLongFormScriptPrompt(topic, language, detail);
    }

    const { parsed, raw } = await sendMessageAndParseJson<{ scripts?: unknown[] }>(generateScript, prompt, {
      maxAttempts: 2,
      retryInstruction: JSON_RETRY_INSTRUCTION,
    });

    const scripts = parsed?.scripts;
    if (!Array.isArray(scripts) || scripts.length === 0) {
      return NextResponse.json({ error: "Invalid script payload from model", raw }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof ModelJsonParseError) {
      return NextResponse.json(
        { error: "Invalid JSON from model", raw: error.raw, attempts: error.attempts },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate script",
      },
      { status: 500 },
    );
  }
}
