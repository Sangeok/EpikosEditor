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

/**
 * Extract the first complete JSON value from a string.
 * This is resilient to model outputs that append non-JSON trailing characters
 * after a valid JSON object/array.
 */
function extractFirstJsonValue(text: string): string | null {
  if (!text) return null;
  const s = extractJsonString(text);

  const start = s.search(/[\[{]/);
  if (start === -1) return null;

  const open = s[start];
  const close = open === "{" ? "}" : "]";

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < s.length; i++) {
    const ch = s[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return s.slice(start, i + 1);
    }
  }

  return null;
}

export function safeParseJson(text: string): any {
  const stripped = extractJsonString(text);

  // 1) Fast path: the whole string is valid JSON.
  try {
    return JSON.parse(stripped);
  } catch {
    // ignore
  }

  // 2) Fallback: parse only the first complete JSON value (ignore trailing junk).
  const candidate = extractFirstJsonValue(stripped);
  if (candidate) {
    return JSON.parse(candidate);
  }

  // 3) Final attempt: throw with original content for easier debugging.
  return JSON.parse(stripped);
}
