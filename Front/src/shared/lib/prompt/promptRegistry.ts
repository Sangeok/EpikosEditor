import {
  LONG_SCRIPT_PROMPT_DarkPsychology_EN,
  LONG_SCRIPT_PROMPT_DarkPsychology_KO,
} from "./longFormScriptPrompt/long-darkPsychology-script";
import {
  LONG_SCRIPT_PROMPT_HISTORY_EN,
  LONG_SCRIPT_PROMPT_HISTORY_KO,
} from "./longFormScriptPrompt/long-history-script";
import {
  LONG_SCRIPT_PROMPT_INTRODUCTION_PERSON_EN,
  LONG_SCRIPT_PROMPT_INTRODUCTION_PERSON_KO,
} from "./longFormScriptPrompt/long-introductionPerson-script";
import {
  LONG_SCRIPT_PROMPT_LIFE_SCIENCE_EN,
  LONG_SCRIPT_PROMPT_LIFE_SCIENCE_KO,
} from "./longFormScriptPrompt/long-lifeScience-script";
import {
  LONG_SCRIPT_PROMPT_PHILOSOPHY_EN,
  LONG_SCRIPT_PROMPT_PHILOSOPHY_KO,
} from "./longFormScriptPrompt/long-philosophy-script";
import { SHORT_SCRIPT_PROMPT_ART_INTERPRETATION_EN } from "./shortFormScriptPrompt/short-artInterpretation-script";
import {
  SHORT_SCRIPT_PROMPT_DarkPsychology_EN,
  SHORT_SCRIPT_PROMPT_DarkPsychology_KO,
} from "./shortFormScriptPrompt/short-darkPsychology-script";
import { SHORT_SCRIPT_PROMPT_FOUR_IDIOMS_KO } from "./shortFormScriptPrompt/short-fourIdioms-script";
import {
  SHORT_SCRIPT_PROMPT_HISTORY_EN,
  SHORT_SCRIPT_PROMPT_HISTORY_KO,
} from "./shortFormScriptPrompt/short-history-script";
import { SHORT_SCRIPT_PROMPT_INTRODUCTION_ANIMAL_FACTS_EN } from "./shortFormScriptPrompt/short-introductionAnimal-script";
import {
  SHORT_SCRIPT_PROMPT_INTRODUCTION_PERSON_EN,
  SHORT_SCRIPT_PROMPT_INTRODUCTION_PERSON_KO,
} from "./shortFormScriptPrompt/short-introductionPerson-script";
import {
  SHORT_SCRIPT_PROMPT_LIFE_SCIENCE_EN,
  SHORT_SCRIPT_PROMPT_LIFE_SCIENCE_KO,
} from "./shortFormScriptPrompt/short-lifeScience-script";
import {
  SHORT_SCRIPT_PROMPT_MOTIVATION_EN,
  SHORT_SCRIPT_PROMPT_MOTIVATION_KO,
} from "./shortFormScriptPrompt/short-motivation-script";
import {
  SHORT_SCRIPT_PROMPT_Philosophy_EN,
  SHORT_SCRIPT_PROMPT_Philosophy_KO,
} from "./shortFormScriptPrompt/short-philosophy-script";
import { SHORT_SCRIPT_PROMPT_PSYCHOLOGY_EXPERIMENT_EN } from "./shortFormScriptPrompt/short-psychologyExperiment-script";

const shortFormScriptRegistry: Record<string, (detail: string) => string> = {
  "Philosophy:English": (detail) => SHORT_SCRIPT_PROMPT_Philosophy_EN.replace("{philosophical quote}", detail),
  "Philosophy:Korean": (detail) =>
    SHORT_SCRIPT_PROMPT_Philosophy_KO.replace("{philosophical quote}", detail).replace("{language}", "Korean"),
  "Introduction Person:English": (detail) =>
    SHORT_SCRIPT_PROMPT_INTRODUCTION_PERSON_EN.replace("{person name}", detail),
  "Introduction Person:Korean": (detail) =>
    SHORT_SCRIPT_PROMPT_INTRODUCTION_PERSON_KO.replace("{person name}", detail).replace("{language}", "Korean"),
  "Introduction Animal Facts:English": (detail) =>
    SHORT_SCRIPT_PROMPT_INTRODUCTION_ANIMAL_FACTS_EN.replace("{animal facts}", detail),
  "Life Science:English": (detail) => SHORT_SCRIPT_PROMPT_LIFE_SCIENCE_EN.replace("{life science}", detail),
  "Life Science:Korean": (detail) =>
    SHORT_SCRIPT_PROMPT_LIFE_SCIENCE_KO.replace("{life science}", detail).replace("{language}", "Korean"),
  "History:English": (detail) => SHORT_SCRIPT_PROMPT_HISTORY_EN.replace("{topic}", detail),
  "History:Korean": (detail) =>
    SHORT_SCRIPT_PROMPT_HISTORY_KO.replace("{topic}", detail).replace("{language}", "Korean"),
  "Dark Psychology:English": (detail) =>
    SHORT_SCRIPT_PROMPT_DarkPsychology_EN.replace("{dark psychology concept}", detail),
  "Dark Psychology:Korean": (detail) =>
    SHORT_SCRIPT_PROMPT_DarkPsychology_KO.replace("{dark psychology concept}", detail).replace("{language}", "Korean"),
  "Psychology Experiment:English": (detail) =>
    SHORT_SCRIPT_PROMPT_PSYCHOLOGY_EXPERIMENT_EN.replace("{psychology experiment}", detail),
  "Art Interpretation:English": (detail) => SHORT_SCRIPT_PROMPT_ART_INTERPRETATION_EN.replace("{artwork name}", detail),
  "Four Idioms:Korean": (detail) =>
    SHORT_SCRIPT_PROMPT_FOUR_IDIOMS_KO.replace("{four idioms}", detail).replace("{language}", "Korean"),
  "Motivation:English": (detail) => SHORT_SCRIPT_PROMPT_MOTIVATION_EN.replace("{topic}", detail),
  "Motivation:Korean": (detail) =>
    SHORT_SCRIPT_PROMPT_MOTIVATION_KO.replace("{topic}", detail).replace("{language}", "Korean"),
};

const longFormScriptRegistry: Record<string, (detail: string) => string> = {
  "Philosophy:English": (detail) => LONG_SCRIPT_PROMPT_PHILOSOPHY_EN.replace("{philosophical quote}", detail),
  "Philosophy:Korean": (detail) =>
    LONG_SCRIPT_PROMPT_PHILOSOPHY_KO.replace("{philosophical quote}", detail).replace("{language}", "Korean"),
  "History:English": (detail) => LONG_SCRIPT_PROMPT_HISTORY_EN.replace("{topic}", detail),
  "History:Korean": (detail) =>
    LONG_SCRIPT_PROMPT_HISTORY_KO.replace("{topic}", detail).replace("{language}", "Korean"),
  "Dark Psychology:English": (detail) =>
    LONG_SCRIPT_PROMPT_DarkPsychology_EN.replace("{dark psychology concept}", detail),
  "Dark Psychology:Korean": (detail) =>
    LONG_SCRIPT_PROMPT_DarkPsychology_KO.replace("{dark psychology concept}", detail).replace("{language}", "Korean"),
  "Life Science:English": (detail) => LONG_SCRIPT_PROMPT_LIFE_SCIENCE_EN.replace("{life science}", detail),
  "Life Science:Korean": (detail) =>
    LONG_SCRIPT_PROMPT_LIFE_SCIENCE_KO.replace("{life science}", detail).replace("{language}", "Korean"),
  "Introduction Person:English": (detail) => LONG_SCRIPT_PROMPT_INTRODUCTION_PERSON_EN.replace("{person name}", detail),
  "Introduction Person:Korean": (detail) =>
    LONG_SCRIPT_PROMPT_INTRODUCTION_PERSON_KO.replace("{person name}", detail).replace("{language}", "Korean"),
};

export function GenShortFormScriptPrompt(topic: string, language: string, detail: string) {
  const key = `${topic}:${language}`;
  console.log("key", key);
  const builder = shortFormScriptRegistry[key];
  if (!builder) throw new Error("Unsupported topic/language");
  return builder(detail);
}

export function GenLongFormScriptPrompt(topic: string, language: string, detail: string) {
  const key = `${topic}:${language}`;
  const builder = longFormScriptRegistry[key];
  if (!builder) throw new Error("Unsupported topic/language");
  return builder(detail);
}
