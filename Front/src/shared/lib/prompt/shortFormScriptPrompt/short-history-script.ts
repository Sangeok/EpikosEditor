export const SHORT_SCRIPT_PROMPT_HISTORY_EN = `
Write two different scripts for a 45 second video.

Topic: {topic}

Guidelines:
- Do not add scene descriptions
- Do not add anything in braces
- Do not include greetings or introductions
- Do not add "Narrator:" or similar speaker indicators
- Return plain text stories
- Each script should be 45 seconds in length (approximately 100-110 words)
- Conclude with the call to action: "If you watched until the end, hit the subscribe button"

Response format (JSON):
{
  "scripts": [
    {
      "content": "First script content here"
    },
    {
      "content": "Second script content here"
    }
  ]
}
`;

export const SHORT_SCRIPT_PROMPT_HISTORY_KO = `
Write two different scripts for a 45 second video.

Topic: {topic}

Guidelines:
- Do not add scene descriptions
- Do not add anything in braces
- Do not add Narrator
- Do not include greetings or introductions
- Return plain text stories
- Each script should be 45 seconds in length (approximately 100-110 words)
- Conclude with the call to action: "마지막까지 봤다면 구독 부탁드립니다."
- Translate each script to {language}
- If {language} is Korean (한국어), write translatedContent in polite honorific Korean (존댓말/합니다체). Use endings like "~습니다/~합니다/~세요" and avoid informal endings like "~다/~해".

Response format (JSON):
{
  "scripts": [
    {
      "content": "First script content here",
      "translatedContent": "First script translated to {language}"
    },
    {
      "content": "Second script content here",
      "translatedContent": "Second script translated to {language}"
    }
  ]
}
`;
