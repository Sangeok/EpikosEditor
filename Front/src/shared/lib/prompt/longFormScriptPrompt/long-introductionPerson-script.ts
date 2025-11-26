export const LONG_SCRIPT_PROMPT_INTRODUCTION_PERSON_KO = `
You are an expert long-form storyteller who crafts gripping 5–6 minute introductions of remarkable people for global audiences.
Write two different scripts for a 5–6 minute video (roughly 750–900 words each).

Topic: {person name}

Guidelines:
- Write each script in English with a natural spoken flow
- Do not add scene descriptions, braces, greetings, introductions, or speaker labels
- Return plain text stories only
- Hook viewers within the first 5 seconds with a bold question or statement about the person’s relevance today
- Establish in one tight line who this person is and why they still matter
- Expand into 4–5 vivid story beats (early struggle, decisive choice, breakthrough, ripple effect, present legacy)
- Around the 40% mark, deliver a “wait, how?” style rehook that reframes their journey
- Around the 70% mark, reveal a lesser-known twist or contradiction that deepens the portrait
- Include at least two concrete numbers, dates, or time spans to anchor credibility
- Use one contrast beat (past vs. present, flaw vs. strength) to show transformation
- Weave in the viewer with second-person phrasing 3–4 times to make the stakes personal
- Close with a high-impact reflection on why understanding this person matters now
- Finish with: "마지막까지 봤다면 구독 부탁드립니다."
- Only use these punctuation marks: ".", ",", "!", "?", "..."
- Translate each script to {language} and store it in "translatedContent" without language tags or parentheses

Response format (JSON):
{
  "scripts": [
    {
      "content": "First 5–6 minute script content here",
      "translatedContent": "First 5–6 minute script translated to {language}"
    },
    {
      "content": "Second 5–6 minute script content here",
      "translatedContent": "Second 5–6 minute script translated to {language}"
    }
  ]
}
`;

export const LONG_SCRIPT_PROMPT_INTRODUCTION_PERSON_EN = `
You are an expert long-form storyteller who specializes in compelling 5–6 minute introductions of remarkable people.
Write two different scripts for a 5–6 minute video (roughly 750–900 words each).

Topic: {person name}

Guidelines:
- No scene descriptions, braces, greetings, introductions, or speaker labels
- Return plain text stories only
- Grab attention within the first 3 seconds with a provocative hook tied to the person’s impact
- In one line, establish who they are and why we should care right now
- Develop 4–5 vivid beats (origin, defining challenge, turning point, cultural impact, current legacy)
- Around the midpoint, pose a “what if” or “did you know” question to rehook curiosity
- Around the 70% mark, surface a surprising or rarely told detail that shifts the narrative
- Cite at least two concrete numbers, dates, or time spans for authority
- Include one contrast beat (old self vs. new self, public image vs. private drive)
- Use the second person sparingly (2–3 times) to tie the stakes to the audience’s life
- Maintain energetic pacing by mixing short punchy lines with reflective paragraphs
- Conclude with the call to action: "If you watched until the end, hit the subscribe button"
- Only use these punctuation marks: ".", ",", "!", "?", "..."

Response format (JSON):
{
  "scripts": [
    { "content": "First 5–6 minute script content here" },
    { "content": "Second 5–6 minute script content here" }
  ]
}
`;
