import { generateImageScript } from "@/shared/lib/AiModel";
import { NextResponse } from "next/server";

const PHILOSOPHY_SCRIPT_PROMPT = `Generate detailed image prompts in {style} style for philosophical quotes: {quote}

Global scene list (JSON): {scenesJson}

Instructions:

1. First, analyze the quote and identify the philosopher who most likely said it. Look for:
   - Distinctive philosophical concepts or terminology
   - Writing style characteristic of specific philosophers
   - Historical context or references within the quote
   - If uncertain about the exact philosopher, determine the philosophical tradition or era

2. Based on your identification, create exactly {scenes.length} detailed image prompts that include:
   - Historically accurate and realistic depiction of the identified philosopher (facial features, clothing, expression, posture, period features)
   - The philosopher's face must closely resemble known historical likenesses (portraits, sculptures); do not stylize or alter facial identity
   - Environmental background (location, time, atmosphere, elements related to the philosopher's era or ideas)
   - Color tone and overall mood (appropriate to the quote's content)
   - Characteristic elements of the {style} style
   - Visual elements suggesting the philosopher is speaking (conversational posture, gestures, mouth shape)

Scene metadata copy rules (do NOT use scenes' text to craft the imagePrompt):
- Produce EXACTLY {scenes.length} output items in the SAME ORDER as the input scenes.
- For each output item at index i, COPY these fields from scenes[i] WITHOUT MODIFICATION:
  - startTime, endTime, duration, type
- Do NOT use scenes[i].text to create or influence the imagePrompt. The imagePrompt must come ONLY from the quote's content and philosophical analysis.

Mandatory constraints:
- The output MUST contain exactly {scenes.length} items (no more, no fewer).
- Depict the philosopher's face and body with realistic human proportions and faithful likeness; avoid cartoonish, abstract, or exaggerated facial stylization.
- Apply {style} primarily to composition, lighting, textures, and background; do not distort the philosopher's facial identity.
- Do not include camera angle directions.
- Focus on visual descriptions that are faithful to the quote's content and philosophical tradition.
- Reflect the appropriate historical background and cultural context.
- Ensure the core message of the quote is visually conveyed.
- If the philosopher cannot be identified with certainty, create an archetypal philosopher figure aligned with the quote's philosophical tradition (e.g., Ancient Greek, Enlightenment, Existentialist) while keeping a realistic depiction.
- All images must be in black and white.
- The philosopher's physical appearance must be clearly depicted.
- Do not create any images related to subscription requests.

Please return ONLY the results in the following JSON format with exactly {scenes.length} objects:
[
  {
    "identifiedPhilosopher": "",
    "imagePrompt": "",
    "quoteContent": "",
    "startTime": <number>,
    "endTime": <number>,
    "duration": <number>,
    "type": "<string>"
  }
]`;

const SCRIPT_PROMPT = `Generate detailed image prompts in {style} style using BOTH the full script and the provided scenes.

Global context (full script): {script}
Scene list (JSON): {scenesJson}

Instructions:
1) Use the full script as global context to maintain consistency of setting, characters, and historical details across all images.
2) For EACH scene in the given array, produce EXACTLY ONE imagePrompt that best visualizes that scene's text while staying consistent with the overall script.
3) Output MUST contain EXACTLY {scenes.length} items, in the SAME ORDER as the input scenes.
4) Each imagePrompt should include:
   - Environmental background (location, time period, weather/atmosphere)
   - Key subjects/objects and their visual details (appearance, attire, expressions, actions)
   - Color tone or mood
   - Distinctive characteristics of the {style} style
5) Preserve historical and narrative accuracy based on the script (e.g., Napoleonic era details if applicable).

Important notes:
- Do NOT include camera angle or lens/shot directions.
- Do NOT include any content related to subscription requests.
- Focus purely on descriptive visual content suitable for image generation.

Return ONLY a JSON array with EXACTLY {scenes.length} objects using this schema (no extra text):
[
  {
    "imagePrompt": "",
    "sceneContent": "<copy the exact scene.text>",
    "startTime": <number>,
    "endTime": <number>,
    "duration": <number>,
    "type": "<copy the exact scene.type>"
  }
]

Example (shortened, illustrative only):
[
  {
    "imagePrompt": "Early 19th-century battlefield under overcast skies, dense ranks of infantry in period uniforms, fluttering French tricolour, distant cavalry silhouettes, smoke from cannon fire drifting across muddy ground; somber monochrome palette enhanced with {style} textures and lighting for drama.",
    "sceneContent": "His military genius led to stunning victories at battles like Austerlitz and Jina, redrawing the map of Europe. France expanded its influence, imposing its will and ideals.",
    "startTime": 15.86,
    "endTime": 26.445,
    "duration": 10.585,
    "type": "image"
  }
]`;

const PSYCHOLOGY_SCRIPT_PROMPT = `Generate detailed image prompts in {style} style using BOTH the full script and the provided scenes.

Global context (full script): {script}
Scene list (JSON): {scenesJson}

Instructions:
1) Use the full script as global context to maintain consistency of setting, characters, and psychological narrative across all images.
2) For EACH scene in the given array, produce EXACTLY ONE imagePrompt that best visualizes that scene's text while staying consistent with the overall script.
3) Output MUST contain EXACTLY {scenes.length} items, in the SAME ORDER as the input scenes.
4) Enforce dark psychology aesthetics in every imagePrompt:
   - Environmental background: extremely dark settings only (pitch-black night, deep shadows, oppressive darkness, fog-covered spaces, abandoned dark interiors, minimal light sources, silhouette-focused compositions, underground locations, etc.)
   - Subjects/objects: appearance, expressions, and poses can be partially obscured by shadows; emphasize tension, anticipation, or inner conflict
   - Color tone/mood: dark tones, low saturation, high contrast; limited palette dominated by blacks and deep blues/purples; chiaroscuro lighting, negative space, vignette effects
   - Integrate distinctive characteristics of the {style} style without breaking the dark constraints
5) Keep each imagePrompt between 30-100 words.
6) Preserve psychological accuracy (e.g., reciprocity dynamics) if present in the script, while avoiding explicit didactic text.

Important notes:
- Do NOT include camera angle or lens/shot directions, or other technical filming instructions.
- Do NOT include any content related to subscription requests.
- Focus purely on descriptive visual content suitable for image generation.

Return ONLY a JSON array with EXACTLY {scenes.length} objects using this schema (no extra text):
[
  {
    "imagePrompt": "",
    "sceneContent": "<copy the exact scene.text>",
    "startTime": <number>,
    "endTime": <number>,
    "duration": <number>,
    "type": "<copy the exact scene.type>",
  }
]

Example (shortened, illustrative only):
[
  {
    "imagePrompt": "Pitch-black supermarket aisle, solitary free-sample kiosk glowing faintly under a flickering tube light; deep shadows swallowing product shelves, a hesitant hand reaching toward the tray, tension in the air; stark high-contrast chiaroscuro with {style} textures conveying subtle social pressure and obligation.",
    "sceneContent": "Think about getting a free sample at the store; you feel more inclined to buy.",
    "startTime": 11.54,
    "endTime": 23.244,
    "duration": 11.704,
    "type": "image",
  }
]`;

export async function POST(req: Request) {
  const { style, script, language, topic, topicDetail, scenes } = await req.json();

  console.log("topic");
  console.log(topic);

  console.log("topicDetail");
  console.log(topicDetail);

  console.log("videoStyle");
  console.log(style);

  console.log("videoScript");
  console.log(script);

  console.log("scenes");
  console.log(scenes);

  console.log("scenes.length");
  console.log(scenes.length);

  let PROMPT;

  if (topic === "Philosophy") {
    PROMPT = PHILOSOPHY_SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{scenes.length}", String(scenes.length))
      .replaceAll("{quote}", String(topicDetail))
      .replaceAll("{scenesJson}", JSON.stringify(scenes));
  } else if (topic === "History") {
    PROMPT = SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{script}", String(script))
      .replaceAll("{scenesJson}", JSON.stringify(scenes))
      .replaceAll("{scenes.length}", String(scenes.length));
  } else if (topic === "Dark Psychology") {
    PROMPT = PSYCHOLOGY_SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{script}", String(script))
      .replaceAll("{scenesJson}", JSON.stringify(scenes))
      .replaceAll("{scenes.length}", String(scenes.length))
      .replaceAll("{language}", String(language ?? ""));
  }

  console.log("PROMPT");
  console.log(PROMPT);

  const result = await generateImageScript.sendMessage(PROMPT as string);

  const response = result?.response?.text();

  console.log("response");
  console.log(response);

  return NextResponse.json(JSON.parse(response));
}
