import { summarizeText } from "./summarizeText.js";
import { summarizeGroq } from "./summarizeGroq.js";

export async function summarize(feedbackText, type) {
  const provider = process.env.AI_PROVIDER ;

  if (provider === "ollama") {
    console.log("🧠 Using Ollama");
    return summarizeText(feedbackText, type);
  }

  console.log("☁️ Using Groq");
  return summarizeGroq(feedbackText, type);
}
