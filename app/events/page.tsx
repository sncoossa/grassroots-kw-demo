"use client"

import { useState, useEffect } from "react"
import { fetchCSVData, type ActionItem } from "@/lib/csv-data"
import { EventCalendar } from "@/components/events/event-calendar"

export default function EventsPage() {
  const [events, setEvents] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchCSVData()
        setEvents(data)
      } catch (error) {
        console.error("Error loading events:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

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

        <EventCalendar events={events} />

        {events.length === 0 ? (
          <p className="text-center text-custom-green/70">No events available</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
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

