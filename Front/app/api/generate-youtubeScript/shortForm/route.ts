import { generateScript } from "@/shared/lib/AiModel";
import { safeParseJson } from "@/shared/lib/jsonUtils";
import { GenShortFormScriptPrompt } from "@/shared/lib/prompt/promptRegistry";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { topic, language, topicDetail } = await req.json();
  const prompt = GenShortFormScriptPrompt(topic, language, topicDetail);
  const result = await generateScript.sendMessage(prompt);
  const response = result?.response?.text();

  try {
    return NextResponse.json(safeParseJson(response as unknown as string));
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON from model", raw: response }, { status: 500 });
  }
}
