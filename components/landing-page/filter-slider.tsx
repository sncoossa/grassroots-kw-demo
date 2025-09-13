import type React from "react"

/**
 * Filter Slider Component Props
 */
interface FilterSliderProps {
  title: string          // Display title for the slider (e.g., "Time", "Effort")
  options: string[]      // Array of options that the slider can select from
  value: string          // Current selected value
  onChange: (index: number) => void  // Callback when slider value changes
}

/**
 * Filter Slider Component
 * 
 * A reusable range slider component for filtering options.
 * Displays a title, slider input, and current value.
 * Used for both Time and Effort filters.
 */
export function FilterSlider({ title, options, value, onChange }: FilterSliderProps) {
  return (
    <div>
      {/* Slider title */}
      <h3 className="mb-4 text-2xl font-instrument-serif text-custom-bg">{title}</h3>
      
      {/* Range slider input */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max={options.length - 1}
          step="1"
          value={options.indexOf(value)}
          onChange={(e) => onChange(Number.parseInt(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      
      {/* Current value display */}
      <p className="mt-2 text-sm font-switzer text-custom-bg/70">{value}</p>
    </div>
  )
}
