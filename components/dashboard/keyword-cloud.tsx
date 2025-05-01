import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReviewWithSentiment } from "@/types/reviews"

interface KeywordCloudProps {
  reviews: ReviewWithSentiment[]
}

export function KeywordCloud({ reviews }: KeywordCloudProps) {
  // Extract all keywords and count occurrences
  const keywordCounts: Record<string, number> = {}

  reviews.forEach((review) => {
    review.sentiment.keywords.forEach((keyword) => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1
    })
  })

  // Convert to array and sort by count
  const sortedKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30) // Take top 30 keywords

  // Find max count for scaling
  const maxCount = sortedKeywords.length > 0 ? sortedKeywords[0][1] : 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Common Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sortedKeywords.map(([keyword, count]) => {
            // Scale font size between 0.75rem and 1.5rem based on count
            const fontSize = 0.75 + (count / maxCount) * 0.75

            // Determine color based on keyword context
            // This is a simple approach - in a real app, you might want to store sentiment with each keyword
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
            ]

            let textColor = "text-foreground"
            if (positiveWords.some((word) => keyword.toLowerCase().includes(word))) {
              textColor = "text-green-500"
            } else if (negativeWords.some((word) => keyword.toLowerCase().includes(word))) {
              textColor = "text-red-500"
            }

            return (
              <span
                key={keyword}
                className={`${textColor} px-2 py-1 rounded-full border`}
                style={{ fontSize: `${fontSize}rem` }}
              >
                {keyword} <span className="text-xs text-muted-foreground">({count})</span>
              </span>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
