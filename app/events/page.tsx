"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { fetchCSVData, filterActions, type ActionItem } from "@/lib/csv-data"
import { EventCalendar } from "@/components/events/event-calendar"
import { PreferencesSection } from "@/components/landing-page/preferences-section"

const TIME_OPTIONS = ["Any", "Minutes", "Hours", "Days", "Weeks"]

const EFFORT_OPTIONS = ["Any", "Individual", "Collective", "Both"]

const INTERESTS_OPTIONS = [
  "Biodiversity",
  "Hackathon",
  "Networking",
  "Social",
  "Education",
  "Business",
  "Waste Management",
  "Gardening",
  "Food",
  "Urban Planning",
  "Transportation",
  "Waterways",
  "Policy",
  "Technology",
]

export default function EventsPage() {
  const [events, setEvents] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)

  const [timeValue, setTimeValue] = useState("Any")
  const [effortValue, setEffortValue] = useState("Any")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [filteredActions, setFilteredActions] = useState<ActionItem[]>([])

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchCSVData()
        setEvents(data)
        setFilteredActions(data)
      } catch (error) {
        console.error("Error loading events:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  useEffect(() => {
    const filtered = filterActions(events, timeValue, effortValue, selectedInterests)
    setFilteredActions(filtered)
  }, [events, timeValue, effortValue, selectedInterests])

  const handleTimeChange = (index: number) => {
    setTimeValue(TIME_OPTIONS[index])
  }

  const handleEffortChange = (index: number) => {
    setEffortValue(EFFORT_OPTIONS[index])
  }

  const handleInterestsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (value && !selectedInterests.includes(value)) {
      setSelectedInterests([...selectedInterests, value])
    }
  }

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter((i) => i !== interest))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-custom-bg pt-24 px-8">
        <div className="container mx-auto">
          <p className="text-center text-custom-green/70">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-custom-bg pt-24 px-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-instrument-serif text-custom-green mb-8">
          Events
        </h1>

        <PreferencesSection
          timeOptions={TIME_OPTIONS}
          effortOptions={EFFORT_OPTIONS}
          interestsOptions={INTERESTS_OPTIONS}
          timeValue={timeValue}
          effortValue={effortValue}
          selectedInterests={selectedInterests}
          filteredActions={filteredActions}
          loading={loading}
          onTimeChange={handleTimeChange}
          onEffortChange={handleEffortChange}
          onInterestsChange={handleInterestsChange}
          onRemoveInterest={removeInterest}
        />

        <EventCalendar events={events} />

        {events.length === 0 ? (
          <p className="text-center text-custom-green/70">No events available</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow mt-8">
            <table className="w-full">
              <thead className="bg-custom-green text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {event.displayDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {event.time}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {event.link ? (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-custom-green hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

