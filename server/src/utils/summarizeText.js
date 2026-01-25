import axios from "axios";

export async function summarizeText(feedbackText, type = "strengths") {
  if (!feedbackText || feedbackText.trim().length < 80) {
    return "";
  }

  const truncatedText = feedbackText.slice(0, 2000);

  const focus =
    type === "improvements"
      ? "main problems, pacing issues, missing fundamentals, and areas needing improvement , and any negative aspects"
      : "main strengths, positive learning experiences, and commonly appreciated qualities , and any positive aspects";

  const prompt = `
You are a professional feedback analyst.

Task:
Extract key insights and present them ONLY as bullet points.

Rules:
- Use bullet points only (• symbol)
- 2 to 4 bullets maximum
- please One sentence per bullet
- No paragraphs
- No titles
- No explanations
- No repetition
- Do NOT use first-person (I, me, my)
- Do NOT mention "feedback", "analysis", or "users"

Focus on:
${focus}

Text:
${truncatedText}

Bullets:
`;

  try {
    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "llama3.2:3b",
        prompt,
        stream: false,
      },
      {
        timeout: 60000,
      }
    );

    return cleanOutput(response.data.response || "");
  } catch (error) {
    console.error("Summarization failed:", error.message);
    return "";
  }
}

function cleanOutput(text) {
  if (!text) return "";

  return text
    .replace(/summary:/gi, "")
    .replace(/^\s*[-*]/gm, "•") 
    .replace(/\n{2,}/g, "\n")
    .trim();
}
