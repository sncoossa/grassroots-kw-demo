import type React from "react"

/**
 * Interests Filter Component Props
 */
interface InterestsFilterProps {
  interests: string[]                                        // Available interest options
  selectedInterests: string[]                                // Currently selected interests
  onInterestsChange: (event: React.ChangeEvent<HTMLSelectElement>) => void  // Handler for adding interests
  onRemoveInterest: (interest: string) => void              // Handler for removing interests
}

/**
 * Interests Filter Component
 * 
 * Provides functionality for users to:
 * - Select interests from a dropdown menu
 * - View currently selected interests as removable tags
 * - Remove interests by clicking the × button
 */
export function InterestsFilter({ 
  interests, 
  selectedInterests, 
  onInterestsChange, 
  onRemoveInterest 
}: InterestsFilterProps) {
  return (
    <div>
      {/* Section title */}
      <h3 className="mb-4 text-2xl font-instrument-serif text-custom-bg">Interests</h3>
      
      {/* Dropdown for selecting new interests */}
      <select
        onChange={onInterestsChange}
        value=""
        className="w-full p-3 border border-custom-bg/30 rounded-lg bg-custom-bg text-custom-green focus:outline-none focus:ring-2 focus:ring-custom-bg"
      >
        <option value="">Select your interests...</option>
        {interests.map((interest) => (
          <option key={interest} value={interest}>
            {interest}
          </option>
        ))}
      </select>

      {/* Display selected interests as removable tags */}
      <div className="mt-2 space-y-1">
        {selectedInterests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1 px-2 py-1 bg-custom-bg text-custom-green text-xs rounded-full"
              >
                {interest}
                {/* Remove interest button */}
                <button
                  onClick={() => onRemoveInterest(interest)}
                  className="ml-1 text-custom-green hover:text-custom-green/70"
                  aria-label={`Remove ${interest} interest`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          /* Empty state message */
          <p className="text-sm text-custom-bg/70">No interests selected</p>
        )}
      </div>
    </div>
  )
}
