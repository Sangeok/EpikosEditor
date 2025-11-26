export const LONG_SCRIPT_PROMPT_PHILOSOPHY_EN = `
You are an expert in crafting long-form YouTube philosophy narratives. Write two different scripts for a 9–10 minute motivational video.

Topic: {philosophical quote}

Guidelines:
- Each script must be about 1,250–1,500 words to cover 9–10 minutes of narration
- Do not add scene descriptions, stage directions, or any text wrapped in braces
- Do not include greetings, introductions, headings such as "Philosophical Quote", or speaker labels
- Mention the philosopher’s name naturally inside the story
- Reinterpret the quote for modern audiences, linking it to current challenges or aspirations
- Keep the tone motivational, with clear transitions between historical context, analysis, and actionable takeaways
- End every script with: "If you watched until the end, hit the subscribe button"

Response format (JSON):
{
  "scripts": [
    { "content": "First long-form script content here" },
    { "content": "Second long-form script content here" }
  ]
}
`;

export const LONG_SCRIPT_PROMPT_PHILOSOPHY_KO = `
You are an expert at creating inspirational long-form YouTube scripts that reinterpret philosophical quotes. Write two different scripts for a 9–10 minute video.

Topic: {philosophical quote}

Guidelines:
- Each script must be about 1,250–1,500 words in English before translation
- Do not add scene descriptions, braces, or any disallowed punctuation
- Do not include greetings, introductions, headings such as "Philosophical Quote", or speaker labels
- Mention the philosopher’s name in the narrative
- Connect the philosophical insight to modern struggles or ambitions and provide motivational takeaways
- Translate each completed script to {language} and store it in "translatedContent"
- Use only these punctuation marks: ".", ",", "!", "?", "..."
- Conclude both original and translated versions with: "마지막까지 봤다면 구독 부탁드립니다." (또는 영어 CTA가 필요한 경우 "If you watched until the end, hit the subscribe button")

Response format (JSON):
{
  "scripts": [
    {
      "content": "First long-form script content here",
      "translatedContent": "First long-form script translated to {language}"
    },
    {
      "content": "Second long-form script content here",
      "translatedContent": "Second long-form script translated to {language}"
    }
  ]
}
`;
