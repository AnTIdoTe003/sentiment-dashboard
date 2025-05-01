import { type NextRequest, NextResponse } from "next/server"
import type { Review } from "@/types/reviews"
import { analyzeSentiment } from "@/lib/sentiment"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const villaId = searchParams.get("id")

    // Fetch reviews from the provided API endpoint
    const response = await fetch(`https://go.saffronstays.com/api/listing-reviews?id=${villaId}`)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const reviews = await response.json()

    // Analyze sentiment for each review
    const analyzedReviews = await Promise.all(
      reviews.data.map(async (review: Review) => {
        const sentiment = await analyzeSentiment(review.guest_review_of_host)
        return {
          ...review,
          sentiment,
        }
      }),
    )

    return NextResponse.json(analyzedReviews)
  } catch (error) {
    console.error("Error fetching or analyzing reviews:", error)
    return NextResponse.json({ error: "Failed to fetch or analyze reviews" }, { status: 500 })
  }
}
