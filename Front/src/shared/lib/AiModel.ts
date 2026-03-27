import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

export const Openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

function sendMessageWithFreshChat(prompt: string) {
  return model.startChat({ generationConfig, history: [] }).sendMessage(prompt);
}

// Keep legacy call shape (`generateScript.sendMessage`) while avoiding shared chat history.
export const generateScript = {
  sendMessage: (prompt: string) => sendMessageWithFreshChat(prompt),
};

export const generateImageScript = {
  sendMessage: (prompt: string) => sendMessageWithFreshChat(prompt),
};
