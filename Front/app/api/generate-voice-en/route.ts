import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, voice } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "text가 없습니다." }, { status: 400 });
    }
    if (!voice) {
      return NextResponse.json({ error: "voice가 없습니다." }, { status: 400 });
    }

    const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || "");

    const response = await deepgram.speak.request(
      { text },
      {
        model: voice,
      }
    );

    const stream = (await response.getStream()) as unknown as NodeJS.ReadableStream;

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("OpenAI TTS API 오류:", error);
    return NextResponse.json({ error: "음성 생성 중 오류가 발생했습니다" }, { status: 500 });
  }
}
