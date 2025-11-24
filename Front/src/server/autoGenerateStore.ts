type AutoGenerateStatus = "pending" | "completed" | "failed";

export interface AutoGeneratePayload {
  message: string;
  data: Record<string, unknown>;
  videoScript: string;
  imageScript: unknown[];
  imageUrls: string[];
  explanation: string | null;
  videoTTs: {
    buffer: Buffer;
    mimeType: string;
  };
  captions: string;
}

export interface AutoGenerateResult {
  jobId: string;
  status: AutoGenerateStatus;
  payload?: AutoGeneratePayload;
  error?: string;
  updatedAt: number;
}

const results = new Map<string, AutoGenerateResult>();

function buildPending(jobId: string): AutoGenerateResult {
  return {
    jobId,
    status: "pending",
    updatedAt: Date.now(),
  };
}

export const autoGenerateStore = {
  saveSuccess(jobId: string, payload: AutoGeneratePayload) {
    results.set(jobId, {
      jobId,
      status: "completed",
      payload,
      updatedAt: Date.now(),
    });
  },

  saveFailure(jobId: string, error: string) {
    results.set(jobId, {
      jobId,
      status: "failed",
      error,
      updatedAt: Date.now(),
    });
  },

  get(jobId: string): AutoGenerateResult {
    return results.get(jobId) ?? buildPending(jobId);
  },
};
