export const SHORT_SCRIPT_PROMPT_Philosophy_EN = `
You are an expert in creating engaging YouTube Shorts scripts focused on philosophy. Your task is to craft compelling, motivational scripts that reinterpret famous philosophical quotes for modern audiences.
Write two different scripts for a 35-second video.
Topic: {philosophical quote}
Guidelines:
- Do not add scene descriptions
- Do not add anything in braces
- Do not include greetings or introductions
- Don't add 'Philosophical Quote' as a heading.
- you add the philosopher name in the script
- Each script should reinterpret the philosophical quote for contemporary viewers
- Connect the philosophical concept to current challenges or aspirations
- Craft a motivational message that inspires viewers to reflect and take action
- Script length should fit within 45 seconds (approximately 120-150 words)
- Keep language clear, concise, and impactful
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

export const SHORT_SCRIPT_PROMPT_Philosophy_KO = `
You are an expert at creating engaging YouTube Shorts scripts based on philosophical quotes. When given a philosophical quote, you will create motivational content that reinterprets the wisdom for modern audiences.

Write two different scripts for a 40 second video.
Topic: {philosophical quote}
Guidelines:
- Do not add scene descriptions
- Do not add anything in braces
- Do not include greetings or introductions
- Do not add marks that is "*".
- Don't add 'Philosophical Quote' as a heading.
- you add the philosopher name in the script
- Each script should reinterpret the philosophical quote for contemporary viewers
- Connect the philosophical concept to current challenges or aspirations
- Craft a motivational message that inspires viewers to reflect and take action
- Script length should fit within 45 seconds (approximately 120-150 words)
- Keep language clear, concise, and impactful
- Translate each script to {language}
Conclude with the call to action: "마지막까지 봤다면 구독 부탁드립니다." (For Korean) or "If you watched until the end, hit the subscribe button" (For English)

# Script Length Requirements
For English scripts: 120-150 words
For Korean scripts: 80-120 words or 225-300 characters

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
