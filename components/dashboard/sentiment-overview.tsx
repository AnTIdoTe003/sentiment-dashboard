import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SentimentStats } from "@/types/reviews"
import { Progress } from "@/components/ui/progress"

interface SentimentOverviewProps {
  stats: SentimentStats
}

export function SentimentOverview({ stats }: SentimentOverviewProps) {
  const positivePercentage = stats.total > 0 ? (stats.positive / stats.total) * 100 : 0
  const negativePercentage = stats.total > 0 ? (stats.negative / stats.total) * 100 : 0
  const neutralPercentage = stats.total > 0 ? (stats.neutral / stats.total) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Overview</CardTitle>
        <CardDescription>Analysis of {stats.total} guest reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Positive</span>
              </div>
              <span className="text-sm font-medium">
                {stats.positive} ({positivePercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={positivePercentage} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">Neutral</span>
              </div>
              <span className="text-sm font-medium">
                {stats.neutral} ({neutralPercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={neutralPercentage} className="h-2 bg-muted" indicatorClassName="bg-yellow-500" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium">Negative</span>
              </div>
              <span className="text-sm font-medium">
                {stats.negative} ({negativePercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={negativePercentage} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Sentiment Score</span>
              <span className="text-sm font-medium">{(stats.averageScore * 100).toFixed(1)}%</span>
            </div>
            <Progress value={stats.averageScore * 100} className="h-2 mt-2 bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
