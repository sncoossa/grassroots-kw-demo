import type React from "react"

interface InterestsFilterProps {
  interests: string[]
  selectedInterests: string[]
  onInterestsChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  onRemoveInterest: (interest: string) => void
}

export function InterestsFilter({ 
  interests, 
  selectedInterests, 
  onInterestsChange, 
  onRemoveInterest 
}: InterestsFilterProps) {
  return (
    <div>
      <h3 className="mb-4 text-2xl font-instrument-serif text-custom-bg">Interests</h3>
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

      {/* Selected Interests */}
      <div className="mt-2 space-y-1">
        {selectedInterests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1 px-2 py-1 bg-custom-highlight text-custom-green text-xs rounded-full"
              >
                {interest}
                <button
                  onClick={() => onRemoveInterest(interest)}
                  className="ml-1 text-custom-green hover:text-custom-green/70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-custom-bg/70">No interests selected</p>
        )}
      </div>
    </div>
  )
}
