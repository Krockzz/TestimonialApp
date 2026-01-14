const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn";

export async function summarizeText(text) {
  if (!text || text.trim().length < 50) {
    return "Not enough data to generate insights.";
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGING_KEY}`,
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 120,
          min_length: 40,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);0
    }

    const data = await response.json();

   
    if (Array.isArray(data) && data[0]?.summary_text) {
      return data[0].summary_text;
    }

    return "Unable to generate insights.";
  } catch (error) {
    console.error("Summarization error:", error.message);
    return "Could not generate insights at this time.";
  }
}
