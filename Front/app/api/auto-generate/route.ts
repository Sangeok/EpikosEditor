import { NextRequest, NextResponse } from "next/server";
import { inngest } from "../../../inngest/client";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const jobId = randomUUID();

  // TODO: body 검증 로직 추가

  const { ids } = await inngest.send({
    name: "generate-media-asset-events",
    data: { ...body, jobId, requestedAt: Date.now() },
  });
  return NextResponse.json({ jobId }, { status: 202 });
}
