import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReviewWithSentiment } from "@/types/reviews"
import { BarChart3, Calendar, Star, Users } from "lucide-react"

interface SummaryCardsProps {
  reviews: ReviewWithSentiment[]
}

export function SummaryCards({ reviews }: SummaryCardsProps) {

  const totalRating = reviews.reduce((sum, review) => sum + Number.parseInt(review.guest_overall_rating), 0)
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

  // Calculate total guests
  const totalGuests = reviews.reduce((sum, review) => sum + review.no_of_guests, 0)

  // Calculate total nights
  const totalNights = reviews.reduce((sum, review) => sum + review.no_of_nights, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reviews.length}</div>
          <p className="text-xs text-muted-foreground">From {reviews.length} unique bookings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Out of 5 stars</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGuests}</div>
          <p className="text-xs text-muted-foreground">Across all bookings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Nights</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalNights}</div>
          <p className="text-xs text-muted-foreground">Across all bookings</p>
        </CardContent>
      </Card>
    </div>
  )
}
