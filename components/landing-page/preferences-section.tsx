import type React from "react"
import type { ActionItem } from "@/lib/csv-data"
import { FilterSlider } from "./filter-slider"
import { InterestsFilter } from "./interests-filter"
import { ActionsGrid } from "./actions-grid"

/**
 * Preferences Section Component Props
 */
interface PreferencesSectionProps {
  // Filter options
  timeOptions: string[]
  effortOptions: string[]
  interestsOptions: string[]
  
  // Current filter values
  timeValue: string
  effortValue: string
  selectedInterests: string[]
  
  // Actions data
  filteredActions: ActionItem[]
  loading: boolean
  
  // Event handlers
  onTimeChange: (index: number) => void
  onEffortChange: (index: number) => void
  onInterestsChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  onRemoveInterest: (interest: string) => void
}

/**
 * Preferences Section Component
 * 
 * The main interactive section of the landing page containing:
 * - Filter controls (Time, Effort, Interests)
 * - Dynamic results count display
 * - Grid of filtered action cards
 * 
 * This component orchestrates all the filtering functionality and
 * presents the results in a cohesive layout.
 */
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
        {/* Filter Controls Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {/* Time commitment filter */}
          <FilterSlider
            title="Time"
            options={timeOptions}
            value={timeValue}
            onChange={onTimeChange}
          />
          
          {/* Effort type filter */}
          <FilterSlider
            title="Effort"
            options={effortOptions}
            value={effortValue}
            onChange={onEffortChange}
          />
          
          {/* Interest categories filter */}
          <InterestsFilter
            interests={interestsOptions}
            selectedInterests={selectedInterests}
            onInterestsChange={onInterestsChange}
            onRemoveInterest={onRemoveInterest}
          />
        </div>

        {/* Filtered Results Section */}
        <div>
          {/* Dynamic results header */}
          <h2 className="mb-6 text-3xl font-instrument-serif text-custom-bg">
            Recommended Actions ({filteredActions.length} found)
          </h2>
          
          {/* Actions grid with loading and empty states */}
          <ActionsGrid actions={filteredActions} loading={loading} />
        </div>
      </div>
    </div>
  )
}
