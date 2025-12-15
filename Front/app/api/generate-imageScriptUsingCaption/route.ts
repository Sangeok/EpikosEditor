import { generateImageScript } from "@/shared/lib/AiModel";
import { NextResponse } from "next/server";

const LIFE_SCIENCE_SCRIPT_PROMPT = `
Generate detailed image prompts in {style} style that reveal the hidden science principles behind everyday moments: {life science}

Global scene list (JSON): {scenesJson}

Instructions:
1) Produce EXACTLY {scenes.length} imagePrompt items, strictly preserving the scene order.
2) Use scenes[i].text as the narrative anchor, but expand each description into a vivid everyday setting where the underlying scientific principle from {life science} becomes visible.
3) For every imagePrompt, include:
   - Concrete daily environment details (location, time of day, lighting, materials) that the audience can immediately recognize.
   - Humans, animals, or objects engaged in the action, emphasizing textures, motions, and interactions that expose the scientific mechanism (forces, flows, reactions, energy transfer, biological cycles, etc.).
   - Visual cues that bridge macro and micro scales (e.g., translucent overlays showing molecular structures, magnetic field lines, airflow ribbons, cross-sections) without turning abstract or diagrammatic.
   - Colors, mood, and compositional traits reflecting the {style} style while keeping the scene believable and accessible.
4) Maintain factual accuracy: align every visual element with the real scientific behavior described; avoid exaggerated fantasy or inaccurate physics/biology.
5) Ensure continuity: keep recurring subjects, props, and ambient tone consistent across scenes when applicable so the audience senses one coherent mini documentary.
6) Keep each imagePrompt between 30 and 90 words.
7) Do NOT include camera angles, lens jargon, or any subscription/meta messaging.

Scene metadata copy rules (do NOT use scenes' text to craft the imagePrompt):
- For each output item at index i, COPY these fields from scenes[i] WITHOUT MODIFICATION:
  - startTime, endTime, duration, type
- Also copy the exact scenes[i].text into "sceneContent".

Important notes:
- Do NOT include camera angle, lens, shot types, or other technical filming directions.
- Do NOT include any content related to subscription requests.
- Focus purely on descriptive visual content suitable for image generation.
- If visual references vary across subspecies or seasonal coats, pick one consistent, plausible variant and maintain it across all prompts.

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
`;

const INTRODUCTION_ANIMAL_FACTS_SCRIPT_PROMPT = `
Generate detailed image prompts in {style} style for introducing a real animal or species: {animal facts}

Global scene list (JSON): {scenesJson}

Instructions:
1) Produce EXACTLY {scenes.length} imagePrompt items, one per scene, in the SAME ORDER as the input scenes.
2) Do NOT use scenes[i].text to create or influence the imagePrompt. Base every imagePrompt ONLY on the biological identity and natural context of {animal name}.
3) Ensure a realistic, consistent depiction of {animal name} across all prompts:
   - Species-accurate morphology (size, proportions), coloration/patterns, textures (fur/feather/scale/skin), sexual dimorphism and life stage (choose one and keep consistent)
   - Typical behaviors, gait/pose, and ecological role
   - Avoid anthropomorphism or stylized changes that alter species identity
   - Apply {style} mainly to composition, lighting, textures, and background without changing the animal’s core appearance
4) Each imagePrompt should include:
   - Natural habitat and environmental background (biome, region, time of day, weather/atmosphere)
   - The animal’s appearance, posture, behavior/action, and any group context (solitary, pair, herd, pack, etc.)
   - Relevant objects or ecological interactions (prey/predators, nesting sites, plants, terrain features, water, etc.)
   - Overall color tone or mood, plus distinctive aspects of the {style} style
5) Keep each imagePrompt between 30-100 words.

Scene metadata copy rules (do NOT use scenes' text to craft the imagePrompt):
- For each output item at index i, COPY these fields from scenes[i] WITHOUT MODIFICATION:
  - startTime, endTime, duration, type
- Also copy the exact scenes[i].text into "sceneContent".

Important notes:
- Do NOT include camera angle, lens, shot types, or other technical filming directions.
- Do NOT include any content related to subscription requests.
- Focus purely on descriptive visual content suitable for image generation.
- If visual references vary across subspecies or seasonal coats, pick one consistent, plausible variant and maintain it across all prompts.

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
]`;

const INTRODUCTION_PERSON_SCRIPT_PROMPT = `
Generate detailed image prompts in {style} style for introducing a real person: {person name}

Global scene list (JSON): {scenesJson}

Instructions:
1) Produce EXACTLY {scenes.length} imagePrompt items, one per scene, in the SAME ORDER as the input scenes.
2) Do NOT use scenes[i].text to create or influence the imagePrompt. Base every imagePrompt ONLY on the identity and life/context of {person name}.
3) Ensure a realistic, consistent likeness of {person name} across all prompts:
   - Facial features, age, hairstyle, skin tone, facial structure, and other recognizable traits
   - Typical attire and signature elements (if any)
   - Avoid stylized or exaggerated changes to the person's facial identity
   - Apply {style} mainly to composition, lighting, textures, and background without altering the person's identity
4) Each imagePrompt should include:
   - Environmental background relevant to the person's life/work/era (location, time, atmosphere)
   - The person’s appearance, attire, expression, pose, and actions
   - Supporting objects/symbols connected to achievements or context
   - Overall color tone or mood, plus distinctive aspects of the {style} style
5) Keep each imagePrompt between 30-100 words.

Scene metadata copy rules (do NOT use scenes' text to craft the imagePrompt):
- For each output item at index i, COPY these fields from scenes[i] WITHOUT MODIFICATION:
  - startTime, endTime, duration, type
- Also copy the exact scenes[i].text into "sceneContent".

Important notes:
- Do NOT include camera angle, lens, shot types, or other technical filming directions.
- Do NOT include any content related to subscription requests.
- Focus purely on descriptive visual content suitable for image generation.
- If public visual references for this person are limited, infer a plausible, neutral, and realistic depiction while keeping consistency across all prompts.

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
]`;

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

const MOTIVATION_SCRIPT_PROMPT = `
Generate detailed image prompts in {style} style for a motivational short-form narration.

Motivation topic detail: {motivation}
Global scene list (JSON): {scenesJson}

Instructions:
1) Choose exactly ONE historical philosopher OR scientist to appear as the main speaker in ALL images.
   - Pick someone long-deceased with well-known portrait likeness.
   - Do NOT choose a living person.
2) Create EXACTLY {scenes.length} imagePrompt items, in the SAME ORDER as the input scenes.
3) Every imagePrompt MUST clearly depict the chosen philosopher or scientist as the primary subject:
   - Face and body visible, realistic human proportions.
   - Era-appropriate clothing and setting.
   - Speaking or teaching cues, expressive posture and hand gestures.
4) You MAY use scenes[i].text as a thematic anchor for symbolism, props, and mood, but do NOT render any text or typography in the image.
5) Keep the identity consistent across all prompts. Do not change age, hairstyle, facial structure, or signature features.
6) Apply {style} mainly to composition, lighting, textures, and atmosphere, without distorting the face.
7) Do NOT include camera angles, lens jargon, shot types, or subscription related content.
8) Keep each imagePrompt between 30 and 100 words, single paragraph, no line breaks.

Scene metadata copy rules:
- For each output item at index i, COPY these fields from scenes[i] WITHOUT MODIFICATION:
  - startTime, endTime, duration, type
- Also copy the exact scenes[i].text into "sceneContent".

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
]
`;

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

const ART_INTERPRETATION_SCRIPT_PROMPT = `
Generate ONE hyperrealistic FULL-VIEW artwork image prompt in {style} style that visually interprets: {artwork interpretation}

Scene list (JSON): {scenesJson}

Objective:
- Output ONLY ONE image that shows the ENTIRE artwork in a single frame and remains visible for the whole video duration.

Full-view and fidelity constraints:
- Show the whole artwork at once with no cropping or partial framing. All essential edges and background structures must remain visible.
- Preserve the original composition and spatial relationships: subject-to-frame scale, posture and gesture, object placement, background layout, negative space proportions, perspective, palette, and lighting.
- Do NOT invent, remove, reposition, or re-pose any elements. No close-up, no zoom, no macro, no tight crop, no truncation.
- Apply {style} only to enhance hyperrealistic materiality and believable light behavior, without altering the artwork’s identity.
- Do NOT include any camera or filming terminology such as lens, angle, shot size, or zoom percentages.

Interpretation integration:
- Weave interpretive cues from scenesJson into this single full view using descriptive emphasis only.
- Mention decisive features and meanings as they appear within the full composition rather than magnifying any region.

imagePrompt content:
- 60-120 words, concrete and precise about surface textures, edges, light falloff, color relationships, and symbolism at full-view scale.
- No subscription or meta instructions.

Output timing and metadata:
- Return ONLY a JSON array with EXACTLY 1 object.
- Set "startTime" to 0.
- Set "endTime" to the "endTime" of the last item in scenesJson (or 0 if empty).
- Set "duration" to endTime - 0.
- Set "type" to "image".
- Set "sceneContent" to the concatenation of all scenes[i].text in order, separated by a single space ("" if scenesJson is empty).

Return ONLY a JSON array with EXACTLY 1 object using this schema (no extra text):
[
  {
    "imagePrompt": "",
    "sceneContent": "",
    "startTime": 0,
    "endTime": <number>,
    "duration": <number>,
    "type": "image"
  }
]
`;

const PSYCHOLOGY_EXPERIMENT_SCRIPT_PROMPT = `
Generate detailed image prompts in {style} style for a psychology experiment: {psychology experiment}

Scene list (JSON): {scenesJson}

Objective:
- Identify the experiment from the name and summarize its core setup and mechanism.
- Create images that closely match the experiment's real context, apparatus, roles, and environment.

Instructions:
1) Produce EXACTLY {scenes.length} imagePrompt items, one per scene, in the SAME ORDER as the input scenes.
2) Use scenes[i].text as the narrative anchor for each imagePrompt; visualize that text faithfully within the accurate context of {psychology experiment}.
3) Enforce experiment fidelity across all prompts:
   - Setting: typical location and period for the experiment (e.g., university lab, mock prison, classroom).
   - Roles: experimenter, participant, confederates, attire and props typical to the study.
   - Apparatus: instruments specific to the experiment (e.g., shock console with labeled switches, comparison line cards, inflatable doll, uniforms and badges). Use generic descriptors; avoid brand names.
   - Keep consistent identities of subjects, props, and room layout across scenes.
4) Each imagePrompt must include:
   - Environmental background and atmosphere appropriate to the experiment
   - Subjects and their actions, expressions, and interactions
   - Salient props/apparatus used in the experiment
   - Overall color tone or mood, plus distinctive aspects of the {style} style
   - Length between 30 and 100 words
5) Do NOT include camera angles, lenses, or shot types. Do NOT include any subscription or meta content.
6) Depict psychological tension responsibly without graphic harm or sensationalism.

Scene metadata copy rules:
- For each output item at index i, COPY these fields from scenes[i] WITHOUT MODIFICATION:
  - startTime, endTime, duration, type
- Also copy the exact scenes[i].text into "sceneContent".

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
    "imagePrompt": "Small university lab room, a console with rows of labeled switches and meters on a plain desk, a participant in everyday clothes seated and looking uneasy, an authority figure in a neutral lab coat with a clipboard standing nearby, another person out of view behind a partition; muted institutional lighting, tense atmosphere; {style} textures emphasize the apparatus central to an obedience study while keeping realism and consistency.",
    "sceneContent": "Volunteers believe they are giving electric shocks for a learning task.",
    "startTime": 0,
    "endTime": 10,
    "duration": 10,
    "type": "image"
  }
]
`;

const FOUR_IDIOMS_SCRIPT_PROMPT = `
Generate detailed image prompts in {style} style inspired by the four idioms: {four idioms}
Global scene list (JSON): {scenesJson}

Instructions:
1) Produce EXACTLY {scenes.length} imagePrompt items, one per scene, in the SAME ORDER as the input scenes.
2) Do NOT use scenes[i].text to craft the imagePrompt. Base every imagePrompt ONLY on the cultural meaning of {four idioms} and heroic imagery of Chinese generals (e.g., Guan Yu, Zhang Fei, Liu Bei, Sun Quan).
3) For each prompt, select or blend generals whose personality best matches the idiom’s theme. Keep facial features, armor style, weapon, and demeanor consistent if the same general appears multiple times.
4) Apply {style} to composition, lighting, textures, and environment while preserving historically plausible details.
5) Each imagePrompt must include:
   - Historical or mythic battlefield/background suited to the idiom’s mood
   - The general’s attire, weapon, pose, facial expression, and notable insignia
   - Symbolic objects or elemental motifs reflecting the idiom’s metaphor
   - Overall color palette or atmosphere plus distinctive aspects of the {style} style
6) Keep each imagePrompt between 30-100 words.

Scene metadata copy rules:
- For each output item at index i, COPY these fields from scenes[i] WITHOUT MODIFICATION:
  - startTime, endTime, duration, type
- Also copy the exact scenes[i].text into "sceneContent".

Important notes:
- Do NOT include camera angle, lens, shot types, or other technical filming directions.
- Do NOT mention subscription or call-to-action content.
- Maintain respectful, heroic depictions without modern slang or pop references.

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
  } else if (topic === "Introduction Person") {
    PROMPT = INTRODUCTION_PERSON_SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{person name}", String(topicDetail))
      .replaceAll("{scenesJson}", JSON.stringify(scenes))
      .replaceAll("{scenes.length}", String(scenes.length));
  } else if (topic === "Introduction Animal Facts") {
    PROMPT = INTRODUCTION_ANIMAL_FACTS_SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{animal facts}", String(topicDetail))
      .replaceAll("{scenesJson}", JSON.stringify(scenes))
      .replaceAll("{scenes.length}", String(scenes.length));
  } else if (topic === "Art Interpretation") {
    PROMPT = ART_INTERPRETATION_SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{artwork interpretation}", String(topicDetail))
      .replaceAll("{scenesJson}", JSON.stringify(scenes))
      .replaceAll("{scenes.length}", String(scenes.length));
  } else if (topic === "Psychology Experiment") {
    PROMPT = PSYCHOLOGY_EXPERIMENT_SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{psychology experiment}", String(topicDetail))
      .replaceAll("{scenesJson}", JSON.stringify(scenes))
      .replaceAll("{scenes.length}", String(scenes.length));
  } else if (topic === "Life Science") {
    PROMPT = LIFE_SCIENCE_SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{life science}", String(topicDetail))
      .replaceAll("{scenesJson}", JSON.stringify(scenes))
      .replaceAll("{scenes.length}", String(scenes.length));
  } else if (topic === "Four Idioms") {
    PROMPT = FOUR_IDIOMS_SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{four idioms}", String(topicDetail))
      .replaceAll("{scenesJson}", JSON.stringify(scenes))
      .replaceAll("{scenes.length}", String(scenes.length));
  } else if (topic === "Motivation") {
    PROMPT = MOTIVATION_SCRIPT_PROMPT.replaceAll("{style}", String(style))
      .replaceAll("{motivation}", String(topicDetail))
      .replaceAll("{scenesJson}", JSON.stringify(scenes))
      .replaceAll("{scenes.length}", String(scenes.length));
  }

  console.log("PROMPT");
  console.log(PROMPT);

  const result = await generateImageScript.sendMessage(PROMPT as string);

  const response = result?.response?.text();

  console.log("response");
  console.log(response);

  return NextResponse.json(JSON.parse(response));
}
