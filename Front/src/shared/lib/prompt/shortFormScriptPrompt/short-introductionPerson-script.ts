export const SHORT_SCRIPT_PROMPT_INTRODUCTION_PERSON_KO = `
You are an expert viral YouTube Shorts scriptwriter who specializes in compelling 45 second introductions of remarkable people for global audiences.
Write two different scripts for a 45 second video.

Topic: {person name}

Guidelines:
- Write each script in English with natural spoken pacing
- Do not add scene descriptions
- Do not add anything in braces
- Do not include greetings or introductions
- Do not add "Narrator" or any speaker labels
- Return plain text stories
- Start with a powerful hook that grabs attention in the first 4 seconds
- In one line, establish who this person is and why they matter today
- Include 2 to 3 vivid beats such as a challenge, a turning point, and an impact
- Add a mid rehook around 15 to 20 seconds with a brief question or twist
- State clearly why this matters to the viewer today in one line
- Use one concrete number or time span to build credibility
- Create one contrast beat such as past versus present or weakness versus strength
- Place the surprising or lesser known detail around 30 to 35 seconds
- Use second person lightly once or twice to deepen engagement
- Keep sentences short and punchy, and vary length with occasional medium sentences
- Keep each English script within 95 to 110 words to fit a 45 second delivery
- If you mention a year, rely only on provided facts or inputs. If uncertain, avoid specific years and use broader phrases such as "recent years"
- Translate each script to {language} and provide it in translatedContent. Ensure the translation preserves meaning and adapts the call to action naturally to {language}.
Conclude with the call to action: "마지막까지 봤다면 구독 부탁드립니다."

# Punctuation Rules:
- ONLY use these punctuation marks: ".", ",", "!", "?", "..."
- DO NOT use any other punctuation or special characters including:
  * No asterisks (*)
  * No dashes (-)
  * No colons (:)
  * No semicolons (;)
  * No parentheses ()
  * No quotation marks ("")
  * No brackets []
  * No braces {}

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

export const SHORT_SCRIPT_PROMPT_INTRODUCTION_PERSON_EN = `
You are an expert viral YouTube Shorts scriptwriter who specializes in compelling 40 second introductions of remarkable people.
Write two different scripts for a 40 second video.

Topic: {person name}

Guidelines:
- Do not add scene descriptions
- Do not add anything in braces
- Do not include greetings or introductions
- Do not add "Narrator" or any speaker labels
- Return plain text stories
- Start with a powerful hook that grabs attention in the first 3 seconds
- In one line, establish who this person is and why they matter today
 - Include 2 to 3 vivid beats such as a challenge, a turning point, and an impact
 - Add a mid rehook around 12 to 18 seconds with a brief question or twist
 - State clearly why this matters to the viewer today in one line
 - Use one concrete number or time span to build credibility
 - Create one contrast beat such as past versus present or weakness versus strength
 - Place the surprising or lesser known detail around 25 to 30 seconds
 - Use second person lightly once or twice to deepen engagement
 - Keep sentences short and punchy, and vary length with occasional medium sentences
- Script length should fit within 40 seconds (approximately 95-110 words)
- Conclude with the call to action: "If you watched until the end, hit the subscribe button"

# Punctuation Rules:
- ONLY use these punctuation marks: ".", ",", "!", "?", "..."
- DO NOT use any other punctuation or special characters including:
  * No asterisks (*)
  * No dashes (-)
  * No colons (:)
  * No semicolons (;)
  * No parentheses ()
  * No quotation marks ("")
  * No brackets []
  * No braces {}

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
