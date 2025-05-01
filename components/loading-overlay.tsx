import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
}

export function LoadingOverlay({ isLoading, message = "Loading data..." }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card shadow-lg border animate-in fade-in zoom-in duration-300">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}
