import type React from "react"
import type { ActionItem } from "@/lib/csv-data"
import { FilterSlider } from "./filter-slider"
import { InterestsFilter } from "./interests-filter"
import { ActionsGrid } from "./actions-grid"

interface PreferencesSectionProps {
  timeOptions: string[]
  effortOptions: string[]
  interestsOptions: string[]
  timeValue: string
  effortValue: string
  selectedInterests: string[]
  filteredActions: ActionItem[]
  loading: boolean
  onTimeChange: (index: number) => void
  onEffortChange: (index: number) => void
  onInterestsChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  onRemoveInterest: (interest: string) => void
}

export function PreferencesSection({
  timeOptions,
  effortOptions,
  interestsOptions,
  timeValue,
  effortValue,
  selectedInterests,
  filteredActions,
  loading,
  onTimeChange,
  onEffortChange,
  onInterestsChange,
  onRemoveInterest
}: PreferencesSectionProps) {
  return (
    <div className="bg-custom-green py-16">
      <div className="container mx-auto px-8">
        {/* Filter Controls */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <FilterSlider
            title="Time"
            options={timeOptions}
            value={timeValue}
            onChange={onTimeChange}
          />
          <FilterSlider
            title="Effort"
            options={effortOptions}
            value={effortValue}
            onChange={onEffortChange}
          />
          <InterestsFilter
            interests={interestsOptions}
            selectedInterests={selectedInterests}
            onInterestsChange={onInterestsChange}
            onRemoveInterest={onRemoveInterest}
          />
        </div>

        {/* Recommended Actions */}
        <div>
          <h2 className="mb-6 text-3xl font-instrument-serif text-custom-bg">
            Recommended Actions ({filteredActions.length} found)
          </h2>
          <ActionsGrid actions={filteredActions} loading={loading} />
        </div>
      </div>
    </div>
  )
}
