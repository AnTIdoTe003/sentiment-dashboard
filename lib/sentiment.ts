import type { SentimentAnalysis } from "@/types/reviews"

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gryphe/mythomax-l2-13b", 
        messages: [
          {
            role: "system",
            content:
              "You are a sentiment analysis expert. Analyze the following review and provide a JSON response with sentiment (positive, negative, or neutral), score (0-1), keywords (array of important sentiment words), and a brief summary.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const result = JSON.parse(data.choices[0].message.content)

    return {
      sentiment: result.sentiment,
      score: result.score,
      keywords: result.keywords,
      summary: result.summary,
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error)

    // Fallback sentiment analysis based on simple keyword matching
    // This is a very basic fallback and should only be used if the API fails
    return fallbackSentimentAnalysis(text)
  }
}

// Simple fallback sentiment analysis in case the API fails
function fallbackSentimentAnalysis(text: string): SentimentAnalysis {
  const lowerText = text.toLowerCase()

  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "love",
    "enjoy",
    "pleasant",
    "clean",
    "helpful",
    "responsive",
    "comfortable",
    "recommend",
  ]
  const negativeWords = [
    "bad",
    "poor",
    "terrible",
    "awful",
    "disappointing",
    "dirty",
    "unresponsive",
    "uncomfortable",
    "issue",
    "problem",
    "complaint",
    "not",
  ]

  let positiveCount = 0
  let negativeCount = 0
  const foundKeywords: string[] = []

  positiveWords.forEach((word) => {
    if (lowerText.includes(word)) {
      positiveCount++
      foundKeywords.push(word)
    }
  })

  negativeWords.forEach((word) => {
    if (lowerText.includes(word)) {
      negativeCount++
      foundKeywords.push(word)
    }
  })

  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  let score = 0.5

  if (positiveCount > negativeCount) {
    sentiment = "positive"
    score = 0.5 + (positiveCount / (positiveCount + negativeCount)) * 0.5
  } else if (negativeCount > positiveCount) {
    sentiment = "negative"
    score = 0.5 - (negativeCount / (positiveCount + negativeCount)) * 0.5
  }

  return {
    sentiment,
    score,
    keywords: foundKeywords.slice(0, 5),
    summary: `This review appears to be ${sentiment} based on keyword analysis.`,
  }
}
