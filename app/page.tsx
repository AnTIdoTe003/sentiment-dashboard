"use client"

import { useEffect, useState } from "react"
import type { ReviewWithSentiment } from "@/types/reviews"
import { calculateSentimentStats } from "@/lib/stats"
import { SentimentOverview } from "@/components/dashboard/sentiment-overview"
import { ReviewList } from "@/components/dashboard/review-list"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { KeywordCloud } from "@/components/dashboard/keyword-cloud"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import axios from "axios"

export default function Home() {
  const [reviews, setReviews] = useState<ReviewWithSentiment[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentVillaId, setCurrentVillaId] = useState<string>("")

  const fetchReviews = async (villaId: string) => {
    try {
      setError(null)
      const isInitialLoad = !refreshing

      if (isInitialLoad) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const response = await axios.get(`/api/reviews`, {
        params: { id: villaId }
      })

      const data = response.data
      console.log("data", data.length)
      if (data) {
        const validReviews = Array.isArray(data)
          ? data.filter(
              (review: { sentiment: { sentiment: any; score: any } }): review is ReviewWithSentiment =>
                review &&
                typeof review === "object" &&
                review.sentiment &&
                typeof review.sentiment.sentiment === "string" &&
                typeof review.sentiment.score === "number"
            )
          : []

        setReviews(validReviews)
      }
    } catch (err) {
      setError("Error loading reviews. Please try again later.")
      console.error("Axios error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }
console.log(reviews.length)
  useEffect(() => {
    fetchReviews(currentVillaId)
  }, [currentVillaId])

  const handleVillaChange = (villaId: string) => {
    setCurrentVillaId(villaId)
  }

  const handleRefresh = () => {
    fetchReviews(currentVillaId)
  }

  const stats = calculateSentimentStats(reviews)

  return (
    <>
      <Header onVillaChange={handleVillaChange} onRefresh={handleRefresh} isRefreshing={refreshing} />

      <LoadingOverlay isLoading={loading} message="Loading sentiment analysis..." />

      <div className="container mx-auto py-6 space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Guest Review Sentiment Analysis</h1>

            <SummaryCards reviews={reviews} />

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <SentimentOverview stats={stats} />
              </div>
              <div className="md:col-span-2">
                <KeywordCloud reviews={reviews} />
              </div>
            </div>

            <Tabs defaultValue="all" className="animate-in fade-in-50 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold">Review Analysis</h2>
                <TabsList>
                  <TabsTrigger value="all">All Reviews</TabsTrigger>
                  <TabsTrigger value="positive">Positive</TabsTrigger>
                  <TabsTrigger value="neutral">Neutral</TabsTrigger>
                  <TabsTrigger value="negative">Negative</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="animate-in fade-in-50 duration-300">
                <ReviewList reviews={reviews} />
              </TabsContent>

              <TabsContent value="positive" className="animate-in fade-in-50 duration-300">
                <ReviewList reviews={reviews.filter((r) => r?.sentiment?.sentiment === "positive")} />
              </TabsContent>

              <TabsContent value="neutral" className="animate-in fade-in-50 duration-300">
                <ReviewList reviews={reviews.filter((r) => r?.sentiment?.sentiment === "neutral")} />
              </TabsContent>

              <TabsContent value="negative" className="animate-in fade-in-50 duration-300">
                <ReviewList reviews={reviews.filter((r) => r?.sentiment?.sentiment === "negative")} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </>
  )
}
