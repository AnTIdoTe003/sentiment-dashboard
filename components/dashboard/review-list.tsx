"use client"

import type { ReviewWithSentiment } from "@/types/reviews"
import { ReviewCard } from "./review-card"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { motion } from "framer-motion"

interface ReviewListProps {
  reviews: ReviewWithSentiment[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.guest_review_of_host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.first_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSentiment = sentimentFilter === "all" || review.sentiment.sentiment === sentimentFilter

    return matchesSearch && matchesSentiment
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="sm:hidden">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        <div className={`sm:flex gap-2 ${showFilters ? "flex" : "hidden"}`}>
          <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiments</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No reviews match your search criteria</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.booking_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
