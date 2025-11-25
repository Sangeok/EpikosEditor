import { SHORT_SCRIPT_PROMPT_ART_INTERPRETATION_EN } from "./shortFormScriptPrompt/short-artInterpretation-script";
import {
  SHORT_SCRIPT_PROMPT_DarkPsychology_EN,
  SHORT_SCRIPT_PROMPT_DarkPsychology_KO,
} from "./shortFormScriptPrompt/short-darkPsychology-script";
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
  SHORT_SCRIPT_PROMPT_Philosophy_EN,
  SHORT_SCRIPT_PROMPT_Philosophy_KO,
} from "./shortFormScriptPrompt/short-philosophy-script";
import { SHORT_SCRIPT_PROMPT_PSYCHOLOGY_EXPERIMENT_EN } from "./shortFormScriptPrompt/short-psychologyExperiment-script";

const registry: Record<string, (detail: string) => string> = {
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
};

export function GenShortFormScriptPrompt(topic: string, language: string, detail: string) {
  const key = `${topic}:${language}`;
  const builder = registry[key];
  if (!builder) throw new Error("Unsupported topic/language");
  return builder(detail);
}
