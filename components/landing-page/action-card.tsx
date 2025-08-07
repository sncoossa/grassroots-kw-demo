import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import type { ActionItem } from "@/lib/csv-data"

interface ActionCardProps {
  action: ActionItem
}

export function ActionCard({ action }: ActionCardProps) {
  return (
    <Card className="bg-highlight border-bg-highlight/30">
      <CardHeader>
        <CardTitle className="text-custom-green text-lg font-instrument-serif">
          {action.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-custom-green/70">
          <p>
            <strong>Date:</strong> {action.displayDate}
          </p>
          <p>
            <strong>Time:</strong> {action.time}
          </p>
          <p>
            <strong>Location:</strong> {action.location}
          </p>
        </div>
        {action.link && (
          <a
            href={action.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-custom-green hover:text-custom-green/80 text-sm font-medium"
          >
            Learn more <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </CardContent>
    </Card>
  )
}
