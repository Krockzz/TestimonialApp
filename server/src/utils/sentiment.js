import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "@xenova/transformers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sentiment;

export async function analyzeSentiment(text) {
  if (!sentiment) {
    const modelPath = path.resolve(__dirname, "../../sentiment-model");

    // console.log("Loading model from:", modelPath);

    sentiment = await pipeline("text-classification", "Xenova/distilbert-base-uncased-finetuned-sst-2-english", {
      model: modelPath,
      quantized: false
    });
  }

  const result = await sentiment(text);
  return result[0];
}
