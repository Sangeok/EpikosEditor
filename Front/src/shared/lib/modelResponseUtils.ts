import { safeParseJson } from "@/shared/lib/jsonUtils";

type JsonModelResponse = {
  response?: {
    text?: () => string;
  };
};

type JsonModelClient = {
  sendMessage: (prompt: string) => Promise<JsonModelResponse>;
};

type ParseJsonOptions = {
  maxAttempts?: number;
  retryInstruction?: string;
};

export class ModelJsonParseError extends Error {
  raw: string;
  attempts: number;
  parseError: unknown;

  constructor(message: string, raw: string, attempts: number, parseError: unknown) {
    super(message);
    this.name = "ModelJsonParseError";
    this.raw = raw;
    this.attempts = attempts;
    this.parseError = parseError;
  }
}

export async function sendMessageAndParseJson<T = unknown>(
  client: JsonModelClient,
  prompt: string,
  options: ParseJsonOptions = {},
): Promise<{ parsed: T; raw: string; attempts: number }> {
  const maxAttempts = Math.max(1, options.maxAttempts ?? 2);
  const retryInstruction = options.retryInstruction?.trim();

  let lastRaw = "";
  let lastParseError: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const promptToSend =
      attempt === 1 || !retryInstruction ? prompt : `${prompt}\n\n${retryInstruction}`;

    const result = await client.sendMessage(promptToSend);
    const raw = result?.response?.text?.() ?? "";
    lastRaw = raw;

    try {
      const parsed = safeParseJson(raw) as T;
      return { parsed, raw, attempts: attempt };
    } catch (error) {
      lastParseError = error;
    }
  }

  throw new ModelJsonParseError("Failed to parse JSON response from model", lastRaw, maxAttempts, lastParseError);
}
