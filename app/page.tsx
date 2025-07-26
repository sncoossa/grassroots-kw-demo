"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { fetchCSVData, filterActions, type ActionItem } from "@/lib/csv-data"
import { useActionState } from "react" // Import useActionState
import { addEmailToWaitlist, type EmailState } from "@/app/actions" // Import the Server Action
import { HeaderBanner } from "@/components/landing-page/header-banner"
import { HeroSection } from "@/components/landing-page/hero-section"
import { PreferencesSection } from "@/components/landing-page/preferences-section"
import { FooterSection } from "@/components/landing-page/footer-section"

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
      <HeaderBanner />
      <HeroSection />
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
      <FooterSection
        emailAction={emailAction}
        isEmailPending={isEmailPending}
        emailState={emailState}
      />
    </div>
  )
}
