export interface Review {
  first_name: string
  user_id: string
  user_profile_image: string
  guest_review_added_on: string
  host_review_of_guest: string
  guest_overall_rating: string
  guest_review_of_host: string
  booking_status: string
  booking_id: string
  no_of_guests: number
  no_of_nights: number
}

export interface SentimentAnalysis {
  sentiment: "positive" | "negative" | "neutral"
  score: number 
  keywords: string[]
  summary: string
}

export interface ReviewWithSentiment extends Review {
  sentiment: SentimentAnalysis
}

export interface SentimentStats {
  positive: number
  negative: number
  neutral: number
  total: number
  averageScore: number
}
