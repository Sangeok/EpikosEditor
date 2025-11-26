export const LONG_SCRIPT_PROMPT_DarkPsychology_KO = `
Create a mid-length YouTube script about the {dark psychology concept} you choose from the list below.
Write two different scripts.
Each script must explain how this psychological effect shapes human behavior in relationships. Keep the narration conversational, provocative, and engaging from the first seconds.

IMPORTANT: Every script must be roughly 600–750 words so it can be delivered in 4–5 minutes when read aloud. Time yourself to confirm the length stays within this window.

Format guidelines:
- Use only these punctuation marks: ".", ",", "!", "?", "..."
- Keep sentences clear and impactful; you may use short paragraphs to separate major beats
- Avoid academic jargon; explain complex ideas with vivid, modern language
- Explicitly mention the selected psychological concept at least once using plain text (no brackets or special formatting)
- Maintain forward momentum with clear transitions between sections

# TEXT FORMATTING RULES:
- STRICTLY PROHIBITED: asterisks (*) or any other symbols for emphasis
- Do not use any special characters beyond the allowed punctuation list
- Emphasis must come from word choice, pacing, and sentence structure

# Punctuation Rules:
- ONLY use ".", ",", "!", "?", "..."
- DO NOT use other punctuation such as "-", ":", ";", "()", quotes, brackets, or braces

# Narrative Flow (expand each step into multiple sentences/paragraphs):
1. Hook: an attention-grabbing claim or question about relationship behavior
2. Common belief: describe what people usually assume about this dynamic
3. Reveal the concept by name and unpack how it truly operates
4. Walk through 2–3 vivid relationship scenarios that illustrate the effect
5. Analyze the psychological mechanism driving those behaviors
6. Offer 2–3 actionable ways to leverage or defend against the principle in persuasion, negotiation, or influence
7. Deliver an insightful reflection on why mastering this concept matters today
8. Conclude with the call to action: "마지막까지 봤다면 구독 부탁드립니다."

Important Instructions:
- No scene descriptions or stage directions
- No greetings, introductions, headings, or numbered lists in the final script
- You MUST translate each script to {language} and store it under "translatedContent"
- Do not label the translated text with language identifiers or parentheses
- Keep tone slightly provocative yet insightful, similar to psychology-secret channels

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

export const LONG_SCRIPT_PROMPT_DarkPsychology_EN = `
Create a mid-length YouTube script about the {dark psychology concept} you choose from the list below.
Write two different scripts.
Each script must explain how this psychological effect shapes human behavior in relationships. Keep the narration conversational, provocative, and engaging from the first seconds.

IMPORTANT: Every script must be roughly 600–750 words so it can be delivered in 4–5 minutes when read aloud. Time yourself to confirm the length stays within this window.

Format guidelines:
- Use only these punctuation marks: ".", ",", "!", "?", "..."
- Keep sentences clear and impactful; you may use short paragraphs to separate major beats
- Avoid academic jargon; explain complex ideas with vivid, modern language
- Explicitly mention the selected psychological concept at least once using plain text (no brackets or special formatting)
- Maintain forward momentum with clear transitions between sections

# TEXT FORMATTING RULES:
- STRICTLY PROHIBITED: asterisks (*) or any other symbols for emphasis
- Do not use any special characters beyond the allowed punctuation list
- Emphasis must come from word choice, pacing, and sentence structure

# Punctuation Rules:
- ONLY use ".", ",", "!", "?", "..."
- DO NOT use other punctuation such as "-", ":", ";", "()", quotes, brackets, or braces

# Narrative Flow (expand each step into multiple sentences/paragraphs):
1. Hook: an attention-grabbing claim or question about relationship behavior
2. Common belief: describe what people usually assume about this dynamic
3. Reveal the concept by name and unpack how it truly operates
4. Walk through 2–3 vivid relationship scenarios that illustrate the effect
5. Analyze the psychological mechanism driving those behaviors
6. Offer 2–3 actionable ways to leverage or defend against the principle in persuasion, negotiation, or influence
7. Deliver an insightful reflection on why mastering this concept matters today
8. Conclude with the call to action: "If you watched until the end, hit the subscribe button"

Important Instructions:
- No scene descriptions or stage directions
- No greetings, introductions, headings, or numbered lists in the final script
- You MUST mention the psychological concept explicitly at least once
- Do not include language identifiers or markers anywhere in the script
- Keep tone slightly provocative yet insightful, similar to psychology-secret channels

Response format (JSON):
{
  "scripts": [
    { "content": "First 4–5 minute script content here" },
    { "content": "Second 4–5 minute script content here" }
  ]
}
`;
