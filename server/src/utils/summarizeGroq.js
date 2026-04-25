import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function summarizeGroq(feedbackText, type = "strengths") {
  if (!feedbackText || feedbackText.trim().length < 80) return "";

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
- One sentence per bullet
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
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    return cleanOutput(
      completion.choices[0]?.message?.content || ""
    );
  } catch (err) {
    console.error("Groq summarization failed:", err.message);
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
