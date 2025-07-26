"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { fetchCSVData, filterActions, type ActionItem } from "@/lib/csv-data"
import { useActionState } from "react" // Import useActionState
import { addEmailToWaitlist, type EmailState } from "@/app/actions" // Import the Server Action
import { ActionCard } from "@/components/landing-page/action-card"

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
  "Technology", // Added Technology
]

export default function GrassrootsKW() {
  const [timeValue, setTimeValue] = useState("Any")
  const [effortValue, setEffortValue] = useState("Any")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [allActions, setAllActions] = useState<ActionItem[]>([])
  const [filteredActions, setFilteredActions] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)

  // State for the email waitlist form
  const [emailState, emailAction, isEmailPending] = useActionState<EmailState, FormData>(addEmailToWaitlist, {
    success: false,
    message: "",
  })

  useEffect(() => {
    async function loadData() {
      const data = await fetchCSVData()
      setAllActions(data)
      setFilteredActions(data)
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    const filtered = filterActions(allActions, timeValue, effortValue, selectedInterests)
    setFilteredActions(filtered)
  }, [allActions, timeValue, effortValue, selectedInterests])

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

  return (
    <div className="min-h-screen bg-custom-bg">
      {/* Header Banner */}
      <div className="bg-custom-bg/80 py-3 px-4 text-center text-sm text-custom-green border-b border-custom-green/20">
        Are you a climate non-profit in the KW region? We think we can help.{" "}
        <a href="mailto:info@grassrootskw.org" className="underline hover:no-underline">
          Contact us
        </a>{" "}
        to learn more
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-8 py-16 text-center flex flex-col items-center">
        {" "}
        {/* Added flex flex-col items-center */}
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-custom-green/70">
          <ArrowRight className="h-4 w-4" />
          Funded by the{" "}
          <a
            href="https://www.kitchener.ca/en/taxes-utilities-and-finance/bloomberg-youth-climate-action-fund.aspx#Hope:~:text=eco%2Dfriendly%20practices.-,Hope%20to%20Action%3A%20Strategic%20Research%20Foundations,-%2D%20Despite%20a%20vibrant"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Youth Climate Action Fund (YCAF)
          </a>
        </div>
        <h1 className="mb-6 text-6xl font-instrument-serif text-custom-green md:text-7xl">grassroots.kw</h1>
        <div className="mb-8 space-y-2">
          <p className="text-lg text-custom-green/80">Discover real local initiatives you can support.</p>
          <p className="text-lg text-custom-green/80">Build community while doing good.</p>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-custom-green py-16">
        <div className="container mx-auto px-8">
          {/* Filter Controls */}
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            {/* Time Slider */}
            <div>
              <h3 className="mb-4 text-2xl font-instrument-serif text-custom-bg">Time</h3>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={TIME_OPTIONS.length - 1}
                  step="1"
                  value={TIME_OPTIONS.indexOf(timeValue)}
                  onChange={(e) => handleTimeChange(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <p className="mt-2 text-sm text-custom-bg/70">{timeValue}</p>
            </div>

            {/* Effort Slider */}
            <div>
              <h3 className="mb-4 text-2xl font-instrument-serif text-custom-bg">Effort</h3>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={EFFORT_OPTIONS.length - 1}
                  step="1"
                  value={EFFORT_OPTIONS.indexOf(effortValue)}
                  onChange={(e) => handleEffortChange(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <p className="mt-2 text-sm text-custom-bg/70">{effortValue}</p>
            </div>

            {/* Interests Dropdown */}
            <div>
              <h3 className="mb-4 text-2xl font-instrument-serif text-custom-bg">Interests</h3>
              <select
                onChange={handleInterestsChange}
                value=""
                className="w-full p-3 border border-custom-bg/30 rounded-lg bg-custom-bg text-custom-green focus:outline-none focus:ring-2 focus:ring-custom-bg"
              >
                <option value="">Select your interests...</option>
                {INTERESTS_OPTIONS.map((interest) => (
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
                        className="inline-flex items-center gap-1 px-2 py-1 bg-custom-bg text-custom-green text-xs rounded-full"
                      >
                        {interest}
                        <button
                          onClick={() => removeInterest(interest)}
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
          </div>

          {/* Recommended Actions */}
          <div>
            <h2 className="mb-6 text-3xl font-instrument-serif text-custom-bg">
              Recommended Actions ({filteredActions.length} found)
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-custom-bg/70">Loading actions...</p>
              </div>
            ) : filteredActions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-custom-bg/70">
                  No actions match your current criteria. Try adjusting your preferences above.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredActions.map((action, index) => (
                  <ActionCard key={index} action={action} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Email Signup */}
      <div className="bg-custom-bg py-16">
        <div className="container mx-auto px-8 text-center">
          <p className="mb-8 text-custom-green/80">
            Interested? Enter your email below and you'll be the first to know when we launch!
          </p>

          <form action={emailAction} className="mx-auto flex max-w-md gap-2">
            <Input
              type="email"
              name="email" // Add name attribute for formData
              placeholder="example@email.com"
              className="flex-1 border-gray-300 text-xl font-instrument-serif" // Changed text-lg to text-xl
              required
            />
            <Button
              type="submit"
              disabled={isEmailPending}
              className="bg-custom-green px-8 text-lg hover:bg-custom-green/90 font-instrument-serif"
            >
              {isEmailPending ? "Submitting..." : "submit"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          {emailState && (
            <p className={`mt-4 text-sm ${emailState.success ? "text-green-600" : "text-red-600"}`}>
              {emailState.message}
            </p>
          )}
          <p className="mt-12 text-sm text-custom-green/60">
            Built by Grassroots KW. We're a small team trying to make a big impact.
          </p>
        </div>
      </div>
    </div>
  )
}
