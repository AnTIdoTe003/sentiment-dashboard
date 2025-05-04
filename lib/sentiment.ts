import axios from "axios";
import type { SentimentAnalysis } from "@/types/reviews";

export async function analyzeSentiment(
  text: string
): Promise<SentimentAnalysis> {
  try {
    const payload = {
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content: `You are a sentiment analysis expert. \nAnalyze the following review and respond with a JSON object ONLY, containing these keys: \n  - sentiment: "positive", "negative", or "neutral"  \n  - score: a number between 0 and 1  \n  - keywords: an array of up to 5 important sentiment words  \n  - summary: a brief summary string`,
        },
        { role: "user", content: text },
      ],
      // remove response_format due to model limitations
      // structured_outputs: true, // optionally enable if your model supports it
    };

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );


    const raw = response.data.choices[0]?.message?.content;
    console.log(response?.data?.choices[0])
    if (!raw) throw new Error("No content in response");
    const jsonText = raw.replace(/```json|```/g, "").trim();
    const parsed: SentimentAnalysis = JSON.parse(jsonText);
    return parsed;
  } catch (error: any) {
    console.error("Error analyzing sentiment with Axios:", error);
    return fallbackSentimentAnalysis(text);
  }
}

function fallbackSentimentAnalysis(text: string): SentimentAnalysis {
  const lowerText = text.toLowerCase();
  const positiveWords = ["good","great","excellent","amazing","wonderful","love","enjoy","pleasant","clean","helpful","responsive","comfortable","recommend"];
  const negativeWords = ["bad","poor","terrible","awful","disappointing","dirty","unresponsive","uncomfortable","issue","problem","complaint","not"];
  let positiveCount = 0, negativeCount = 0;
  const foundKeywords: string[] = [];
  positiveWords.forEach(w => { if (lowerText.includes(w)) { positiveCount++; foundKeywords.push(w); }});
  negativeWords.forEach(w => { if (lowerText.includes(w)) { negativeCount++; foundKeywords.push(w); }});
  let sentiment: "positive"|"negative"|"neutral" = "neutral";
  let score = 0.5;
  if (positiveCount>negativeCount) { sentiment = "positive"; score = 0.5 + (positiveCount/(positiveCount+negativeCount))*0.5; }
  else if (negativeCount>positiveCount) { sentiment = "negative"; score = 0.5 - (negativeCount/(positiveCount+negativeCount))*0.5; }
  return { sentiment, score, keywords: foundKeywords.slice(0,5), summary: `This review appears to be ${sentiment} based on keyword analysis.` };
}
