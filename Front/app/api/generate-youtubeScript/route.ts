import { generateScript } from "@/shared/lib/AiModel";
import { NextResponse } from "next/server";

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

function safeParseJson(text: string): any {
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

const SCRIPT_PROMPT_INTRODUCTION_PERSON_EN = `
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

const SCRIPT_PROMPT_INTRODUCTION_ANIMAL_FACTS_EN = `
You are an expert viral YouTube Shorts scriptwriter who specializes in compelling 40 second introductions of remarkable animals and species, based on little-known facts.
Write two different scripts for a 40 second video.

Animal facts: {animal facts}

Guidelines:
- Do not add scene descriptions
- Do not add anything in braces
- Do not include greetings or introductions
- Do not add "Narrator" or any speaker labels
- Return plain text stories
- Start with a powerful hook built directly from the provided fact to grab attention in the first 3 seconds
- In one line, name the animal and explain why this fact matters or what it reveals about the animal
- Include 2 to 3 vivid beats such as habitat, the adaptation or behavior behind the fact, and a survival challenge or role in the ecosystem
- Add a mid rehook around 12 to 18 seconds with a brief question or twist that deepens curiosity about the fact
- State clearly why this matters to the viewer today in one line (practical insight, wonder, conservation, or relevance)
- Use one concrete number, measurement, or time span to build credibility (preferably tied to the fact)
- Create one contrast beat such as myth versus reality, past versus present, or small versus powerful
- Place a surprising or lesser known detail related to the fact around 25 to 30 seconds
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

const SCRIPT_PROMPT_INTRODUCTION_PERSON_KO = `
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

const SCRIPT_PROMPT_Philosophy_EN = `
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

const SCRIPT_PROMPT_Philosophy_KO = `
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

const SCRIPT_PROMPT_EN = `
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

const SCRIPT_PROMPT_KO = `
Write two different scripts for a 45 second video.

Topic: {topic}

Guidelines:
- Do not add scene descriptions
- Do not add anything in braces
- Do not add Narrator
- Do not include greetings or introductions
- Return plain text stories
- Each script should be 45 seconds in length (approximately 100-110 words)
- Translate each script to {language}
- Conclude with the call to action: "마지막까지 봤다면 구독 부탁드립니다."

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

const SCRIPT_PROMPT_DarkPsychology_KO = `
Create a YouTube Shorts script about the {dark psychology concept} you choose from the list below.
Write two different scripts.
The script should explain how this psychological effect influences human behavior in human relationships. Write in a conversational, engaging style that would capture viewer attention in the first few seconds.

IMPORTANT: The script must be precisely 40-45 seconds in length when read aloud. This is approximately 100-120 words for English or 500-700 characters for Korean. Please time yourself reading the script to ensure it fits exactly within the 40-45 second timeframe.

Format guidelines:
- Use only these punctuation marks: ".", ",", "!", "?", "..."
- Keep sentences short and impactful
- Avoid academic jargon - explain complex concepts in simple terms
- Don't use paragraph breaks
- Write with a quick-paced delivery in mind
- Explicitly mention the name of the selected psychological concept at least once in the script
- Naturally incorporate the selected psychological concept into the script without using any special formatting or symbols

# TEXT FORMATTING RULES:
- STRICTLY PROHIBITED: Do not use asterisks (*) anywhere in the script for emphasis or any other purpose
- Never use any special characters or symbols for emphasis
- Emphasis should be created through word choice and sentence structure only

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

# Text Emphasis Guidelines:
- Instead of using asterisks for emphasis, use strong word choices and sentence structure
- Focus on word selection to convey intensity rather than typographical emphasis
- Use question marks and exclamation points (sparingly) to create emphasis

Examples of CORRECT ways to emphasize without asterisks:
- Instead of "this is *very* important", write "this is extremely important"
- Instead of "people *always* do this", write "people invariably do this"
- Instead of "I *need* you to listen", write "I absolutely need you to listen"

Structure the script to follow this flow:
1. Start with an attention-grabbing claim or question about human behavior in relationships
2. Explain how people typically think about this aspect of psychology
3. Reveal the psychological effect by its name (e.g., "this is called Gaslighting") and explain how it actually works
4. Provide 1-2 relationship examples that demonstrate this effect
5. Explain why this happens (the underlying mechanism)
6. Suggest 1-2 ways to apply this psychological principle to your advantage (methods that can be used for persuasion, negotiation, or influence)
7. End with an insightful observation about why understanding this principle is important
8. Conclude with the call to action: "마지막까지 봤다면 구독 부탁드립니다." (For Korean) or "If you watched until the end, hit the subscribe button" (For English)

Important Instructions:
- Do not add scene descriptions
- Do not include braces or curly brackets {} anywhere in the script
- Do not include asterisks (*) anywhere in the script for emphasis or any other purpose
- Do not include the name of the concept in braces or with any special formatting
- You MUST mention the name of the psychological concept explicitly at least once in the script
- Do not include greetings or introductions
- Use ONLY these punctuation marks: ".", ",", "!", "?", "..."
- Do not use any other punctuation marks or special characters such as "{}", "*", "'", "-", ":", ";", "()", etc.
- Don't add headings such as 'Psychology Technique'
- Keep language clear, concise, and impactful
- Translate each script to {language} (for English, use "English"; for Korean, use "Korean")
- Do not include the language name in parentheses like "(Korean)" or "(English)" anywhere in the script or at the end of the script
- Do not add any language identifiers or markers to the translated content
- When you see {dark psychology concept} in this prompt, replace it with the actual concept you choose from the list when processing the prompt, but do not include any braces in your final script
- The methods you suggest should be practical and specific, clearly explaining how they can be applied in particular situations
- Always end the script with a subscription call-to-action ("마지막까지 봤다면 구독을 눌러달라" for Korean or "If you watched until the end, hit the subscribe button" for English)
- Include this call-to-action within the 40-45 second time limit

Examples of CORRECT ways to mention the concept:
- "This is what we know as Gaslighting. It is an influence tactic."
- "Gaslighting happens when someone makes you doubt your own reality."
- "This influence technique is called Gaslighting."
- "What you are experiencing is Gaslighting. It happens when..."

Examples of applying psychological principles:
- "To use Inception Persuasion when suggesting ideas in meetings, first mention that the other person probably had a similar thought. This makes them feel the suggestion is their own idea and they'll be more likely to accept it."
- "To leverage the Scarcity Effect when selling an important product, clearly mention limited quantities or limited time availability. This significantly increases people's desire to purchase."
- "During negotiations, utilize Confirmation Bias by first presenting information that aligns with the other person's existing beliefs. This makes them more open to your subsequent proposals."

The tone should be slightly provocative but insightful, similar to channels that share "psychology secrets" or "influence techniques" in short-form content.

Please time yourself reading the final script aloud to verify it can be delivered within exactly 40-45 seconds before submitting.

# Response Format (JSON):
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

const SCRIPT_PROMPT_DarkPsychology_EN = `
Create a YouTube Shorts script about the {dark psychology concept} you choose from the list below.
Write two different scripts.
The script should explain how this psychological effect influences human behavior in human relationships. Write in a conversational, engaging style that would capture viewer attention in the first few seconds.

IMPORTANT: The script must be precisely 40 seconds in length when read aloud. This is approximately 95-100 words for English. Please time yourself reading the script to ensure it fits exactly within the 35-40 second timeframe.

Format guidelines:
- Use only these punctuation marks: ".", ",", "!", "?", "..."
- Keep sentences short and impactful
- Avoid academic jargon - explain complex concepts in simple terms
- Don't use paragraph breaks
- Write with a quick-paced delivery in mind
- Explicitly mention the name of the selected psychological concept at least once in the script
- Naturally incorporate the selected psychological concept into the script without using any special formatting or symbols

# TEXT FORMATTING RULES:
- STRICTLY PROHIBITED: Do not use asterisks (*) anywhere in the script for emphasis or any other purpose
- Never use any special characters or symbols for emphasis
- Emphasis should be created through word choice and sentence structure only

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

# Text Emphasis Guidelines:
- Instead of using asterisks for emphasis, use strong word choices and sentence structure
- Focus on word selection to convey intensity rather than typographical emphasis
- Use question marks and exclamation points (sparingly) to create emphasis

Examples of CORRECT ways to emphasize without asterisks:
- Instead of "this is *very* important", write "this is extremely important"
- Instead of "people *always* do this", write "people invariably do this"
- Instead of "I *need* you to listen", write "I absolutely need you to listen"

Structure the script to follow this flow:
1. Start with an attention-grabbing claim or question about human behavior in relationships
2. Explain how people typically think about this aspect of psychology
3. Reveal the psychological effect by its name (e.g., "this is called Gaslighting") and explain how it actually works
4. Provide 1-2 relationship examples that demonstrate this effect
5. Explain why this happens (the underlying mechanism)
6. Suggest 1-2 ways to apply this psychological principle to your advantage (methods that can be used for persuasion, negotiation, or influence)
7. End with an insightful observation about why understanding this principle is important
8. Conclude with the call to action: "If you watched until the end, hit the subscribe button".

Important Instructions:
- Do not add scene descriptions
- Do not include braces or curly brackets {} anywhere in the script
- Do not include asterisks (*) anywhere in the script for emphasis or any other purpose
- Do not include the name of the concept in braces or with any special formatting
- You MUST mention the name of the psychological concept explicitly at least once in the script
- Do not include greetings or introductions
- Use ONLY these punctuation marks: ".", ",", "!", "?", "..."
- Do not use any other punctuation marks or special characters such as "{}", "*", "'", "-", ":", ";", "()", etc.
- Don't add headings such as 'Psychology Technique'
- Keep language clear, concise, and impactful
- Do not include the language name in parentheses like "(Korean)" or "(English)" anywhere in the script or at the end of the script
- Do not add any language identifiers or markers to the translated content
- When you see {dark psychology concept} in this prompt, replace it with the actual concept you choose from the list when processing the prompt, but do not include any braces in your final script
- The methods you suggest should be practical and specific, clearly explaining how they can be applied in particular situations
- Always end the script with a subscription call-to-action ("If you watched until the end, hit the subscribe button" for English)
- Include this call-to-action within the 40-45 second time limit

Examples of CORRECT ways to mention the concept:
- "This is what we know as Gaslighting. It is an influence tactic."
- "Gaslighting happens when someone makes you doubt your own reality."
- "This influence technique is called Gaslighting."
- "What you are experiencing is Gaslighting. It happens when..."

Examples of applying psychological principles:
- "To use Inception Persuasion when suggesting ideas in meetings, first mention that the other person probably had a similar thought. This makes them feel the suggestion is their own idea and they'll be more likely to accept it."
- "To leverage the Scarcity Effect when selling an important product, clearly mention limited quantities or limited time availability. This significantly increases people's desire to purchase."
- "During negotiations, utilize Confirmation Bias by first presenting information that aligns with the other person's existing beliefs. This makes them more open to your subsequent proposals."

The tone should be slightly provocative but insightful, similar to channels that share "psychology secrets" or "influence techniques" in short-form content.

Please time yourself reading the final script aloud to verify it can be delivered within exactly 35-40 seconds before submitting.

# Response Format (JSON):
{
  "scripts": [
    {
      "content": "First script content here",
    },
    {
      "content": "Second script content here",
    }
  ]
}
`;

const SCRIPT_PROMPT_ART_INTERPRETATION_EN = `
You are an expert viral YouTube Shorts scriptwriter who specializes in interpreting famous artworks for a general audience.
Write two different scripts for a ~50 second video.

Artwork: {artwork name}

Goal:
- Interpret the meaning of the artwork by analyzing its key visual elements and how they work together.
- Keep it accurate, engaging, and easy to follow for non experts.

Guidelines:
- Do not add scene descriptions or camera directions
- Do not add anything in braces
- Do not include greetings or introductions
- Do not add speaker labels or headings
- Return plain text stories
- Start with a strong hook in the first 3 to 4 seconds that frames a compelling question or claim about the artwork
- Mention the artwork name once near the beginning
- Identify and interpret 4 to 6 concrete elements such as composition, gaze, hands, background, light and shadow, color palette, perspective, symbolism, brushwork, or geometry
- For each element, briefly explain what it is and what it means in the context of the artwork
- Add one concise line of historical or cultural context if relevant
- Include one mid rehook between 20 to 30 seconds that deepens curiosity
- Use one specific detail or number to anchor credibility
- Explain why this interpretation matters to today’s viewer in one line
- Keep sentences short and varied for rhythm
- Script length should fit within about 50 seconds (approximately 120 to 135 words)
- Conclude with the call to action: "If you watched until the end, hit the subscribe button"

Punctuation Rules:
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

const SCRIPT_PROMPT_WhatIF_EN = `
You are an expert viral YouTube Shorts scriptwriter specializing in "What If" series. Your task is to create compelling, viral-potential scripts around 45 seconds in length.

Topic: {what if scenario}

* Guidelines:
- Do not add scene descriptions or directing instructions
- Do not use curly braces or square brackets
- Do not include greetings or introductions
- Do not use "What If" as a title
- Start with a powerful hook statement within the first 4 seconds
- Use realistic basis or scientific estimates for hypothetical scenarios
- Write convincing script content for the {what if scenario} that audiences can believe
- Script content should be imagination-based but rational and logically convincing
- Instead of talking abstractly, Create Script specifically to draw people's interest
- When talking specifically, naturally discuss scenarios related to the {what if scenario}.
- 
- Script length should fit within 45 seconds (approximately 100-115 words)
- Conclude with the call to action: "If you watched until the end, hit the subscribe button"

* Punctuation Rules:
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

* Response format (JSON):
{
  "scripts": [
    {
      "content": "First script content"
    },
    {
      "content": "Second script content"
    }
  ]
}
`;

const SCRIPT_PROMPT_PSYCHOLOGY_EXPERIMENT_EN = `
You are an expert viral YouTube Shorts scriptwriter who explains famous psychology experiments in simple, engaging language for a general audience.
Write two different scripts for a ~55 second video.

Psychology Experiment: {psychology experiment}

Goal:
- Explain what this experiment is in one plain sentence anyone can understand.
- Make it relatable and interesting so viewers care today.

Guidelines:
- Do not add scene descriptions or camera directions
- Do not add anything in braces
- Do not include greetings or introductions
- Do not add speaker labels or headings
- Return plain text stories
- Start with a strong hook in the first 3 to 4 seconds using simple words
- In one line near the beginning, define the experiment in simple terms as if explaining to a teenager
- Use 4 to 6 concrete beats: setup, what people did, what happened next, the surprising result, the main debate, and real world use today
- Use one short real life example or analogy to make it easy to picture
- Include one mid rehook between 20 to 30 seconds as a quick question or twist
- Use one specific number or outcome to anchor credibility (for example, a percent or count)
- Use short sentences, active voice, and everyday words
- Avoid jargon; if a term appears, explain it in one short line
- Explain why this matters to today’s viewer in one line and give one practical takeaway
- Keep sentences short and varied for rhythm
- Script length should fit within about 55 seconds (approximately 135 to 155 words)
- Conclude with the call to action: "If you watched until the end, hit the subscribe button"

Punctuation Rules:
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

export async function POST(req: Request) {
  const { topic, language, topicDetail } = await req.json();
  console.log("topic");
  console.log(topic);

  console.log("topicDetail");
  console.log(topicDetail);

  console.log("language");
  console.log(language);

  let PROMPT;

  if (topic === "Philosophy") {
    if (language === "English") {
      PROMPT = SCRIPT_PROMPT_Philosophy_EN.replace("{philosophical quote}", topicDetail);
    } else {
      PROMPT = SCRIPT_PROMPT_Philosophy_KO.replace("{philosophical quote}", topicDetail).replace(
        "{language}",
        language
      );
    }
  } else if (topic === "Dark Psychology") {
    if (language === "English") {
      PROMPT = SCRIPT_PROMPT_DarkPsychology_EN.replace("{dark psychology concept}", topicDetail).replace(
        "{language}",
        language
      );
    } else {
      PROMPT = SCRIPT_PROMPT_DarkPsychology_KO.replace("{dark psychology concept}", topicDetail).replace(
        "{language}",
        language
      );
    }
  } else if (topic === "History") {
    if (language === "English") {
      PROMPT = SCRIPT_PROMPT_EN.replace("{topic}", topicDetail);
    } else {
      PROMPT = SCRIPT_PROMPT_KO.replace("{topic}", topicDetail).replace("{language}", language);
    }
  } else if (topic === "What If") {
    if (language === "English") {
      PROMPT = SCRIPT_PROMPT_WhatIF_EN.replace("{what if scenario}", topicDetail);
    } else {
      // PROMPT = SCRIPT_PROMPT_WhatIF_KO.replace("{what if scenario}", topicDetail).replace("{language}", language);
    }
  } else if (topic === "Introduction Person") {
    if (language === "English") {
      PROMPT = SCRIPT_PROMPT_INTRODUCTION_PERSON_EN.replace("{person name}", topicDetail);
    } else {
      PROMPT = SCRIPT_PROMPT_INTRODUCTION_PERSON_KO.replace("{person name}", topicDetail).replace(
        "{language}",
        language
      );
    }
  } else if (topic === "Introduction Animal Facts") {
    if (language === "English") {
      PROMPT = SCRIPT_PROMPT_INTRODUCTION_ANIMAL_FACTS_EN.replace("{animal facts}", topicDetail);
    } else {
      // PROMPT = SCRIPT_PROMPT_INTRODUCTION_ANIMAL_KO.replace("{animal name}", topicDetail).replace(
      //   "{language}",
      //   language
      // );
    }
  } else if (topic === "Art Interpretation") {
    if (language === "English") {
      PROMPT = SCRIPT_PROMPT_ART_INTERPRETATION_EN.replace("{artwork name}", topicDetail);
    } else {
      // PROMPT = SCRIPT_PROMPT_ART_INTERPRETATION_KO.replace("{artwork name}", topicDetail).replace(
      //   "{language}",
      //   language
      // );
    }
  } else if (topic === "Psychology Experiment") {
    if (language === "English") {
      PROMPT = SCRIPT_PROMPT_PSYCHOLOGY_EXPERIMENT_EN.replace("{psychology experiment}", topicDetail);
    } else {
      // PROMPT = SCRIPT_PROMPT_PSYCHOLOGY_EXPERIMENT_KO.replace("{psychology experiment}", topicDetail).replace(
      //   "{language}",
      //   language
      // );
    }
  }

  const result = await generateScript.sendMessage(PROMPT as string);

  const response = result?.response?.text();

  console.log("response", response);

  try {
    const parsed = safeParseJson(response as unknown as string);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Failed to parse JSON response from model", err);
    return NextResponse.json({ error: "Invalid JSON from model", raw: response }, { status: 500 });
  }
}
