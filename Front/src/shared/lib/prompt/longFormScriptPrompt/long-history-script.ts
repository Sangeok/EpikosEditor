export const LONG_SCRIPT_PROMPT_HISTORY_EN = `
Write two different scripts for a 4–5 minute narrative video.

Topic: {topic}

Guidelines:
- Each script must be roughly 600–750 words to cover 4–5 minutes of spoken narration
- Do not add scene descriptions, stage directions, or any text wrapped in braces
- Do not include greetings, introductions, or speaker labels such as "Narrator:"
- Keep the storytelling chronological (or clearly segmented) with smooth transitions between key beats
- Use vivid but concise historical detail; emphasize stakes and consequences without dialogue formatting
- Conclude every script with the call to action: "If you watched until the end, hit the subscribe button"

Response format (JSON):
{
  "scripts": [
    { "content": "First mid-length script content here" },
    { "content": "Second mid-length script content here" }
  ]
}
`;

export const LONG_SCRIPT_PROMPT_HISTORY_KO = `
Write two different scripts for a 4–5 minute narrative video.

Topic: {topic}

Guidelines:
- Each script must be roughly 600–750 words to cover 4–5 minutes of spoken narration
- Do not add scene descriptions, stage directions, or any text wrapped in braces
- Do not include Narrator labels, greetings, or introductions
- Keep the storytelling chronological (or clearly segmented) with smooth transitions between historical beats
- Translate each completed script to {language} and store it under "translatedContent"
- Conclude every script (both original and translation) with: "마지막까지 봤다면 구독 부탁드립니다."

Response format (JSON):
{
  "scripts": [
    {
      "content": "First mid-length script content here",
      "translatedContent": "First mid-length script translated to {language}"
    },
    {
      "content": "Second mid-length script content here",
      "translatedContent": "Second mid-length script translated to {language}"
    }
  ]
}
`;
