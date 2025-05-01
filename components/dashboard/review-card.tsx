"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReviewWithSentiment } from "@/types/reviews"
import { formatDate } from "@/lib/stats"
import { Badge } from "@/components/ui/badge"
import { ThumbsDown, ThumbsUp, Minus, ChevronDown, ChevronUp } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ReviewCardProps {
  review: ReviewWithSentiment
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)

  const sentimentIcon =
    review.sentiment.sentiment === "positive" ? (
      <ThumbsUp className="h-4 w-4" />
    ) : review.sentiment.sentiment === "negative" ? (
      <ThumbsDown className="h-4 w-4" />
    ) : (
      <Minus className="h-4 w-4" />
    )

  // Truncate text if it's too long and not expanded
  const maxLength = 150
  const isTextLong = review.guest_review_of_host.length > maxLength
  const displayText =
    !expanded && isTextLong ? `${review.guest_review_of_host.substring(0, maxLength)}...` : review.guest_review_of_host

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{review.first_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{review.first_name}</CardTitle>
              <CardDescription>{formatDate(review.guest_review_added_on)}</CardDescription>
            </div>
          </div>
          <Badge
            variant={
              review.sentiment.sentiment === "positive"
                ? "success"
                : review.sentiment.sentiment === "negative"
                  ? "destructive"
                  : "secondary"
            }
            className="flex items-center gap-1"
          >
            {sentimentIcon}
            {review.sentiment.sentiment.charAt(0).toUpperCase() + review.sentiment.sentiment.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn("text-sm transition-all duration-300", expanded ? "line-clamp-none" : "line-clamp-3")}>
          {displayText}
        </p>
        {isTextLong && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 p-0 h-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        )}
        <div className="mt-3 flex flex-wrap gap-1">
          {review.sentiment.keywords.map((keyword, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-3">
        <div className="flex justify-between w-full">
          <span>Booking ID: {review.booking_id}</span>
          <span>Rating: {review.guest_overall_rating}/5</span>
        </div>
      </CardFooter>
    </Card>
  )
}
