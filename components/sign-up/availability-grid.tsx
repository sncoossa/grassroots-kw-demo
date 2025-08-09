import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { DAYS_OF_WEEK, TIME_SLOTS, AvailabilitySlot } from "./constants"

interface AvailabilityGridProps {
  availability: AvailabilitySlot[]
  setAvailability: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>
  isScheduledEvent: boolean
}

export function AvailabilityGrid({ 
  availability, 
  setAvailability, 
  isScheduledEvent 
}: AvailabilityGridProps) {
  // Drag selection state
  const [isDragging, setIsDragging] = useState(false)
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select')
  const [dragStarted, setDragStarted] = useState(false)
  const [dragStart, setDragStart] = useState<{ day: string, timeSlot: string } | null>(null)
  const [dragCurrent, setDragCurrent] = useState<{ day: string, timeSlot: string } | null>(null)
  const [initialDragState, setInitialDragState] = useState<AvailabilitySlot[]>([])

  const setAvailabilitySlot = (day: string, timeSlot: string, isSelected: boolean) => {
    setAvailability(prev => 
      prev.map(slot => 
        slot.day === day && slot.timeSlot === timeSlot
          ? { ...slot, isSelected }
          : slot
      )
    )
  }

  const getSlotIndices = (day: string, timeSlot: string) => {
    return {
      dayIndex: DAYS_OF_WEEK.indexOf(day),
      timeIndex: TIME_SLOTS.indexOf(timeSlot)
    }
  }

  const selectRectangle = (start: { day: string, timeSlot: string }, end: { day: string, timeSlot: string }, mode: 'select' | 'deselect') => {
    const startIndices = getSlotIndices(start.day, start.timeSlot)
    const endIndices = getSlotIndices(end.day, end.timeSlot)
    
    // Handle invalid indices
    if (startIndices.dayIndex === -1 || startIndices.timeIndex === -1 || 
        endIndices.dayIndex === -1 || endIndices.timeIndex === -1) {
      return
    }
    
    const minDayIndex = Math.min(startIndices.dayIndex, endIndices.dayIndex)
    const maxDayIndex = Math.max(startIndices.dayIndex, endIndices.dayIndex)
    const minTimeIndex = Math.min(startIndices.timeIndex, endIndices.timeIndex)
    const maxTimeIndex = Math.max(startIndices.timeIndex, endIndices.timeIndex)
    
    // Start with the initial state and only modify slots within current rectangle
    setAvailability(prev => 
      prev.map((slot, index) => {
        const dayIndex = DAYS_OF_WEEK.indexOf(slot.day)
        const timeIndex = TIME_SLOTS.indexOf(slot.timeSlot)
        
        // Check if this slot is within the current rectangle
        const isInCurrentRectangle = dayIndex >= minDayIndex && dayIndex <= maxDayIndex &&
                                    timeIndex >= minTimeIndex && timeIndex <= maxTimeIndex
        
        if (isInCurrentRectangle) {
          // Modify slots within current rectangle based on drag mode
          return { ...slot, isSelected: mode === 'select' }
        } else {
          // For slots outside current rectangle, restore to initial state
          return { ...slot, isSelected: initialDragState[index]?.isSelected ?? slot.isSelected }
        }
      })
    )
  }

  const handleSlotMouseDown = (day: string, timeSlot: string) => {
    // Don't allow modification if this is a scheduled event
    if (isScheduledEvent) return
    
    const slot = availability.find(s => s.day === day && s.timeSlot === timeSlot)
    const newState = !slot?.isSelected
    
    // Store the initial state before starting drag
    setInitialDragState([...availability])
    
    setIsDragging(true)
    setDragStarted(true)
    setDragMode(newState ? 'select' : 'deselect')
    setDragStart({ day, timeSlot })
    setDragCurrent({ day, timeSlot })
    
    // Set the initial slot
    setAvailabilitySlot(day, timeSlot, newState)
    
    // Prevent text selection and default behaviors
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
  }

  const handleSlotMouseOver = (day: string, timeSlot: string) => {
    // Don't allow modification if this is a scheduled event
    if (isScheduledEvent) return
    
    if (isDragging && dragStarted && dragStart) {
      setDragCurrent({ day, timeSlot })
      selectRectangle(dragStart, { day, timeSlot }, dragMode)
    }
  }

  const handleSlotClick = (day: string, timeSlot: string, e: React.MouseEvent) => {
    // Don't allow modification if this is a scheduled event
    if (isScheduledEvent) return
    
    // Only handle click if we haven't been dragging
    if (!dragStarted) {
      e.preventDefault()
      const slot = availability.find(s => s.day === day && s.timeSlot === timeSlot)
      setAvailabilitySlot(day, timeSlot, !slot?.isSelected)
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setDragStart(null)
      setDragCurrent(null)
      setInitialDragState([]) // Clear the initial state
      // Small delay to prevent click event from firing after drag
      setTimeout(() => setDragStarted(false), 10)
      
      // Re-enable text selection
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
    }
  }

  // Add global mouse up listener to handle dragging outside the grid
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  const getSelectedAvailability = () => {
    return availability
      .filter(slot => slot.isSelected)
      .map(slot => `${slot.day} - ${slot.timeSlot}`)
      .join(', ')
  }

  return (
    <div className="space-y-4">
      <Label className="text-custom-green font-medium">
        {isScheduledEvent 
          ? "Event Schedule" 
          : "When are you typically available? (Optional)"
        }
      </Label>
      <p className="text-sm text-custom-green/70 mb-4">
        {isScheduledEvent 
          ? "This event has a set schedule shown below. All participants will meet at these times."
          : "Click individual slots or drag to select multiple time slots when you're available."
        }
      </p>
      
      {/* Availability Grid */}
      <div 
        className="border border-custom-green/30 rounded-lg p-4 bg-custom-bg/50 select-none"
        onMouseLeave={() => handleMouseUp()}
      >
        {/* Header row with days of the week */}
        <div className="grid grid-cols-8 gap-2 mb-3">
          <div></div> {/* Empty cell for alignment */}
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-xs font-medium text-custom-green/80 text-center p-2">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>
        
        {/* Time slots and availability grid */}
        {TIME_SLOTS.map((timeSlot) => (
          <div key={timeSlot} className="grid grid-cols-8 gap-2 mb-2">
            {/* Time slot label */}
            <div className="text-xs font-medium text-custom-green p-1 flex items-center whitespace-nowrap">
              {timeSlot}
            </div>
            
            {/* Day slots for this time */}
            {DAYS_OF_WEEK.map((day) => {
              const slot = availability.find(
                s => s.day === day && s.timeSlot === timeSlot
              )
              return (
                <div
                  key={`${day}-${timeSlot}`}
                  className={`
                    p-2 rounded text-xs transition-colors select-none
                    min-h-[32px] min-w-[40px] flex items-center justify-center
                    ${isScheduledEvent 
                      ? (slot?.isSelected 
                        ? 'bg-custom-green text-custom-bg border-2 border-custom-green' 
                        : 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed')
                      : `cursor-pointer ${slot?.isSelected 
                        ? 'bg-custom-green text-custom-bg' 
                        : 'bg-custom-bg border border-custom-green/30 text-custom-green hover:bg-custom-green/10'}`
                    }
                  `}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSlotMouseDown(day, timeSlot)
                  }}
                  onMouseOver={() => handleSlotMouseOver(day, timeSlot)}
                  onMouseUp={handleMouseUp}
                  onClick={(e) => handleSlotClick(day, timeSlot, e)}
                  style={{ 
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                  }}
                >
                  <span className="w-3 h-3 flex items-center justify-center">
                    {slot?.isSelected ? (isScheduledEvent ? '●' : '✓') : ''}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      
      {/* Instructions */}
      {!isScheduledEvent && (
        <p className="text-xs text-custom-green/60">
          💡 Tip: Hold and drag your mouse to select multiple time slots at once
        </p>
      )}
      
      {isScheduledEvent && (
        <p className="text-xs text-custom-green/60">
          🔒 Event times are locked and cannot be modified
        </p>
      )}
    </div>
  )
}
