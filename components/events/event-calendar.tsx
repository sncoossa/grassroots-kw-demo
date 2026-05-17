"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ActionItem } from "@/lib/csv-data"
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"

interface EventCalendarProps {
  events: ActionItem[]
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get the first and last day of the month
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  // Get the starting day of the week for the month
  const startingDayOfWeek = firstDay.getDay()

  // Days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Create a map of events by date (YYYY-MM-DD format)
  const eventsByDate: Record<string, ActionItem[]> = {}
  
  const parseDisplayDate = (displayDate: string): Date | undefined => {
    // Try to parse "Month Day, Year" format (e.g., "November 27, 2025")
    const dateObj = new Date(displayDate)
    if (!isNaN(dateObj.getTime())) {
      return dateObj
    }
    return undefined
  }
  
  events.forEach((event) => {
    // Use parsedDate if available, otherwise try to parse displayDate
    let eventDate = event.parsedDate
    if (!eventDate && event.displayDate !== "N/A") {
      eventDate = parseDisplayDate(event.displayDate)
    }
    
    if (eventDate) {
      const year = eventDate.getFullYear()
      const month = String(eventDate.getMonth() + 1).padStart(2, "0")
      const day = String(eventDate.getDate()).padStart(2, "0")
      const dateKey = `${year}-${month}-${day}`
      
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = []
      }
      eventsByDate[dateKey].push(event)
    }
  })
  
  logger.log("Events by date:", eventsByDate)
  logger.log("Total events mapped:", Object.values(eventsByDate).flat().length)

  // Generate calendar days
  const calendarDays: (number | null)[] = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    calendarDays.push(i)
  }

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    // Don't go back more than 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    if (newDate >= sixMonthsAgo) {
      setCurrentDate(newDate)
    }
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    // Don't go forward more than 6 months
    const sixMonthsAhead = new Date()
    sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6)
    if (newDate <= sixMonthsAhead) {
      setCurrentDate(newDate)
    }
  }

  const today = new Date()
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1)
  const sixMonthsAhead = new Date(today.getFullYear(), today.getMonth() + 6, 1)
  
  const canGoPrevious = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) > sixMonthsAgo
  const canGoNext = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) < sixMonthsAhead

  const monthYearString = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-instrument-serif text-custom-green">
          {monthYearString}
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={handlePreviousMonth}
            disabled={!canGoPrevious}
            variant="outline"
            size="sm"
            className={canGoPrevious ? "text-custom-green border-custom-green hover:bg-custom-highlight" : ""}
            style={!canGoPrevious ? { color: "#d1d5db", borderColor: "#d1d5db", opacity: 0.5, cursor: "not-allowed" } : {}}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleNextMonth}
            disabled={!canGoNext}
            variant="outline"
            size="sm"
            className={canGoNext ? "text-custom-green border-custom-green hover:bg-custom-highlight" : ""}
            style={!canGoNext ? { color: "#d1d5db", borderColor: "#d1d5db", opacity: 0.5, cursor: "not-allowed" } : {}}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-xs text-custom-green p-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dateKey =
            day !== null
              ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  .toISOString()
                  .split("T")[0]
              : null

          const dayEvents = dateKey ? (eventsByDate[dateKey] || []) : []
          const hasEvents = dayEvents.length > 0

          return (
            <div
              key={index}
              className={`p-1 rounded border text-center ${
                day === null
                  ? "bg-gray-50 border-gray-200"
                  : hasEvents
                    ? "border-custom-green bg-custom-highlight"
                    : "border-gray-200 hover:border-custom-green"
              }`}
              title={hasEvents ? dayEvents.map(e => e.title).join(", ") : undefined}
            >
              {day && (
                <div>
                  <div className="font-semibold text-custom-green text-xs">
                    {day}
                  </div>
                  {hasEvents && (
                    <div className="mt-0.5">
                      {dayEvents.slice(0, 2).map((event, i) => (
                        <a
                          key={i}
                          href={event.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-white rounded px-1 py-0.5 text-[10px] leading-tight border border-custom-green/20 shadow-sm hover:shadow-md hover:border-custom-green transition-all cursor-pointer mb-0.5 truncate"
                          title={event.title}
                        >
                          <span className="font-medium text-custom-green truncate block">
                            {event.title}
                          </span>
                        </a>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-custom-green/60 font-medium">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>
          Showing {Object.keys(eventsByDate).length} days with events this month
        </p>
      </div>
    </div>
  )
}
