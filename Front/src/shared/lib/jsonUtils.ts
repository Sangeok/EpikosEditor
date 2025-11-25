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

export function safeParseJson(text: string): any {
  const stripped = extractJsonString(text);
  try {
    return JSON.parse(stripped);
  } catch (e) {
    const first = stripped.indexOf("{");
    const last = stripped.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      const candidate = stripped.slice(first, last + 1).trim();
      try {
        return JSON.parse(candidate);
      } catch (_) {
        // fall-through
      }
    }
    throw e;
  }
}
