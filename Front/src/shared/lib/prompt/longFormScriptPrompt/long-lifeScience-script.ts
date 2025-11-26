export const LONG_SCRIPT_PROMPT_LIFE_SCIENCE_EN = `
You are an expert viral storyteller who translates everyday life science into gripping 4–5 minute narratives.
Write two different scripts for a 4–5 minute video (roughly 600–750 words each).

Topic: {life science}

Guidelines:
- No scene descriptions, braces, greetings, introductions, or speaker labels
- Return plain text stories only
- Open with a startling everyday observation or question tied to the topic that hooks within the first 5 seconds
- Immediately restate the phenomenon and why most people overlook it
- Develop 3–4 vivid beats that unpack the science using micro-stories, analogies, or quick experiments
- Around the halfway mark, insert a rehook (a “what if” or “did you notice” style question) that reframes the audience’s assumptions
- Around the 70% mark, introduce an unexpected twist or lesser-known implication that adds fresh stakes
- Provide at least two concrete numbers, measurements, or time spans to quantify the effect
- Connect the insight to modern decisions, health, tech, or culture with evidence viewers can observe themselves
- Use second person sparingly (2–3 times) to help the audience imagine the science in their own life
- Keep pacing dynamic: mix short punchy lines with occasional medium-length reflections
- Conclude with the call to action: "If you watched until the end, hit the subscribe button"
- Only use these punctuation marks: ".", ",", "!", "?", "..."

Response format (JSON):
{
  "scripts": [
    { "content": "First 4–5 minute script content here" },
    { "content": "Second 4–5 minute script content here" }
  ]
}
`;

export const LONG_SCRIPT_PROMPT_LIFE_SCIENCE_KO = `
You are an expert viral storyteller who translates everyday life science into gripping 4–5 minute narratives.
Write two different scripts for a 4–5 minute video (roughly 600–750 words each).

Topic: {life science}

Guidelines:
- Write each script in English first with natural spoken pacing
- No scene descriptions, braces, greetings, introductions, or speaker labels
- Return plain text stories only
- Start with a startling everyday observation or question tied to the topic that hooks within the first 5 seconds
- Clearly restate the phenomenon and why most people overlook it
- Map out 3–4 vivid beats explaining the core science via micro-stories, analogies, or simple experiments
- Around the halfway point, add a “what if” or “did you notice” question to rehook viewers
- Around the 70% mark, reveal an unexpected twist or lesser-known detail that reframes the science
- Provide at least two concrete numbers, measurements, or time spans for credibility
- Tie the insight to daily decisions, health, tech, or cultural trends with observable evidence (avoid speculation)
- Use second person sparingly (2–3 times) to ground the phenomenon in the viewer’s life
- Maintain energetic pacing with varied sentence lengths
- Translate each script to {language} in "translatedContent"; adapt the CTA naturally to {language}
- End every script (original and translation) with: "마지막까지 봤다면 구독 부탁드립니다."
- Only use these punctuation marks: ".", ",", "!", "?", "..."

Response format (JSON):
{
  "scripts": [
    {
      "content": "First 4–5 minute script content here",
      "translatedContent": "First 4–5 minute script translated to {language}"
    },
    {
      "content": "Second 4–5 minute script content here",
      "translatedContent": "Second 4–5 minute script translated to {language}"
    }
  ]
}
`;
