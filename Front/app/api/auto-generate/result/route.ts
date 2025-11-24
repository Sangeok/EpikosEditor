import { NextRequest, NextResponse } from "next/server";
import { autoGenerateStore, AutoGeneratePayload } from "@/server/autoGenerateStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, payload, error } = body as {
      jobId?: string;
      payload?: AutoGeneratePayload;
      error?: string;
    };

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    if (error) {
      autoGenerateStore.saveFailure(jobId, error);
    } else if (payload) {
      autoGenerateStore.saveSuccess(jobId, payload);
    } else {
      return NextResponse.json({ error: "payload or error is required" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to store auto-generate result", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "jobId query param is required" }, { status: 400 });
  }

  const result = autoGenerateStore.get(jobId);
  return NextResponse.json(result);
}

