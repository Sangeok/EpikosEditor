import { generateScript } from "@/shared/lib/AiModel";
import { ModelJsonParseError, sendMessageAndParseJson } from "@/shared/lib/modelResponseUtils";
import { NextResponse } from "next/server";

const SCRIPT_PROMPT = `
    Translate the following text to {targetLanguage}:
    {text}

    Give me response in JSON format and follow the schema
    {
        translatedText: ""
    }
`;

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    const PROMPT = SCRIPT_PROMPT.replace("{text}", text).replace("{targetLanguage}", targetLanguage);

    const { parsed } = await sendMessageAndParseJson<{ translatedText?: string }>(generateScript, PROMPT, {
      maxAttempts: 2,
      retryInstruction: "Return ONLY valid JSON matching the schema.",
    });

    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof ModelJsonParseError) {
      return NextResponse.json(
        { error: "Invalid JSON from model", raw: error.raw, attempts: error.attempts },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to translate script" }, { status: 500 });
  }
}
