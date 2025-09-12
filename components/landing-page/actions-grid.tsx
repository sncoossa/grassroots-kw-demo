import type { ActionItem } from "@/lib/csv-data"
import { ActionCard } from "./action-card"

/**
 * Actions Grid Component Props
 */
interface ActionsGridProps {
  actions: ActionItem[]  // Array of filtered actions to display
  loading: boolean       // Loading state for data fetching
}

/**
 * Actions Grid Component
 * 
 * Handles the display logic for action cards including:
 * - Loading state with spinner message
 * - Empty state when no actions match filters
 * - Responsive grid layout for action cards
 * 
 * This component abstracts the different states of the actions list
 * and provides a clean interface for the parent component.
 */
export function ActionsGrid({ actions, loading }: ActionsGridProps) {
  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-custom-bg/70">Loading actions...</p>
      </div>
    )
  }

  // Show empty state when no actions match current filters
  if (actions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-custom-bg/70">
          No actions match your current criteria. Try adjusting your preferences above.
        </p>
      </div>
    )
  }

  // Render grid of action cards
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, index) => (
        <ActionCard key={index} action={action} />
      ))}
    </div>
  )
}
