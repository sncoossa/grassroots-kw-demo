import type React from "react"

interface FilterSliderProps {
  title: string
  options: string[]
  value: string
  onChange: (index: number) => void
}

export function FilterSlider({ title, options, value, onChange }: FilterSliderProps) {
  return (
    <div>
      <h3 className="mb-4 text-2xl font-instrument-serif text-custom-bg">{title}</h3>
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
      <p className="mt-2 text-sm font-switzer text-custom-bg/70">{value}</p>
    </div>
  )
}
