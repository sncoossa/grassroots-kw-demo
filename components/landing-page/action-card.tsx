import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, UserPlus } from "lucide-react"
import Link from "next/link"
import type { ActionItem } from "@/lib/csv-data"

/**
 * Action Card Component Props
 */
interface ActionCardProps {
  action: ActionItem  // The action data to display
}

/**
 * Action Card Component
 * 
 * Displays an individual action/event in a card format including:
 * - Action title
 * - Date, time, and location information
 * - Optional external link with "Learn more" text
 * 
 * Used within the ActionsGrid to show filtered results.
 */
export function ActionCard({ action }: ActionCardProps) {
  return (
    <Card className="bg-custom-bg border-custom-bg/30">
      <CardHeader>
        {/* Action title */}
        <CardTitle className="text-custom-green text-lg font-instrument-serif">
          {action.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Action details and sign up button */}
        <div className="flex items-start justify-between gap-4 pr-2">
          <div className="text-sm text-custom-green/70 flex-1">
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
          
          {/* Circular sign up button */}
          <Link href="/sign-up/indicate-interest">
            <Button 
              className="bg-custom-green text-custom-bg hover:bg-custom-green/90 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0"
              size="sm"
            >
              <UserPlus className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        {/* Optional external link */}
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
