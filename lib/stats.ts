import type { ReviewWithSentiment, SentimentStats } from "@/types/reviews"

export function calculateSentimentStats(reviews: ReviewWithSentiment[]): SentimentStats {
  const stats: SentimentStats = {
    positive: 0,
    negative: 0,
    neutral: 0,
    total: reviews.length,
    averageScore: 0,
  }

  let totalScore = 0

  reviews.forEach((review) => {
    const sentiment = review?.sentiment;
    const sentimentLabel = sentiment?.sentiment;
    const score = sentiment?.score ?? 0;
  
    if (sentimentLabel === "positive") {
      stats.positive++;
    } else if (sentimentLabel === "negative") {
      stats.negative++;
    } else {
      stats.neutral++;
    }
  
    totalScore += score;
  });
  

  stats.averageScore = reviews.length > 0 ? totalScore / reviews.length : 0

  return stats
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}
