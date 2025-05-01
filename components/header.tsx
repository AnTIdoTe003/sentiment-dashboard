"use client"
import dynamic from "next/dynamic"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { BarChart3, RefreshCcw } from "lucide-react"
import Link from "next/link"
const VillaSelector = dynamic(() => import('./villa-selector'), {
  ssr: false,
});

interface HeaderProps {
  onVillaChange: (villaId: string) => void
  onRefresh: () => void
  isRefreshing: boolean
}

export default function Header({ onVillaChange, onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <Link href="/" className="font-semibold">
            Sentiment Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <VillaSelector onVillaChange={onVillaChange} />
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing} className="relative">
            <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
