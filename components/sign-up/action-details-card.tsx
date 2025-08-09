import { Card, CardContent } from "@/components/ui/card"
import { Lock } from "lucide-react"

interface ActionDetailsCardProps {
  actionTitle?: string
  actionDate?: string
  actionTime?: string
  actionLocation?: string
  isScheduledEvent: boolean
}

export function ActionDetailsCard({ 
  actionTitle, 
  actionDate, 
  actionTime, 
  actionLocation, 
  isScheduledEvent 
}: ActionDetailsCardProps) {
  if (!actionTitle) return null

  return (
    <Card className="mb-4 p-4 bg-custom-green/10 border border-custom-green/30">
      <CardContent className="p-0">
        <h2 className="text-xl font-instrument-serif text-custom-green mb-2">
          {actionTitle}
        </h2>
        <div className="text-sm text-custom-green/80 space-y-1">
          {actionDate && <p><strong>Date:</strong> {actionDate}</p>}
          {actionTime && <p><strong>Time:</strong> {actionTime}</p>}
          {actionLocation && <p><strong>Location:</strong> {actionLocation}</p>}
        </div>
        {isScheduledEvent && (
          <p className="text-xs text-custom-green/60 mt-2 flex items-center">
            <Lock className="h-3 w-3 mr-1" />
            This event has a set schedule. Availability selection is pre-filled and locked.
          </p>
        )}
        {actionTime && !isScheduledEvent && (
          <p className="text-xs text-custom-green/60 mt-2">
            ℹ️ This event has flexible timing. Please indicate your availability below.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
