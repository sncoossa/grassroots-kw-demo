import type { ActionItem } from "@/lib/csv-data"
import { ActionCard } from "./action-card"

interface ActionsGridProps {
  actions: ActionItem[]
  loading: boolean
}

export function ActionsGrid({ actions, loading }: ActionsGridProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-custom-bg/70 font-switzer">Loading actions...</p>
      </div>
    )
  }

  if (actions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-custom-bg/70 font-switzer">
          No actions match your current criteria. Try adjusting your preferences above.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, index) => (
        <ActionCard key={index} action={action} />
      ))}
    </div>
  )
}
