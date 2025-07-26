"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { fetchCSVData, filterActions, type ActionItem } from "@/lib/csv-data"
import { useActionState } from "react" // Import useActionState for form handling
import { addEmailToWaitlist, type EmailState } from "@/app/actions" // Import the Server Action
import { HeaderBanner } from "@/components/landing-page/header-banner"
import { HeroSection } from "@/components/landing-page/hero-section"
import { PreferencesSection } from "@/components/landing-page/preferences-section"
import { FooterSection } from "@/components/landing-page/footer-section"

// Filter options for time commitment levels
const TIME_OPTIONS = ["Any", "Minutes", "Hours", "Days", "Weeks"]

// Filter options for effort types (individual vs collective actions)
const EFFORT_OPTIONS = ["Any", "Individual", "Collective", "Both"]

// Available interest categories for filtering actions
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

/**
 * Main landing page component for Grassroots KW
 * Manages application state and coordinates all child components
 */
export default function GrassrootsKW() {
  // Filter state management
  const [timeValue, setTimeValue] = useState("Any")
  const [effortValue, setEffortValue] = useState("Any")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  
  // Actions data state
  const [allActions, setAllActions] = useState<ActionItem[]>([])
  const [filteredActions, setFilteredActions] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)

  // Email waitlist form state using useActionState hook
  const [emailState, emailAction, isEmailPending] = useActionState<EmailState, FormData>(addEmailToWaitlist, {
    success: false,
    message: "",
  })

  // Load initial data from CSV on component mount
  useEffect(() => {
    async function loadData() {
      const data = await fetchCSVData()
      setAllActions(data)
      setFilteredActions(data)
      setLoading(false)
    }
    loadData()
  }, [])

  // Filter actions whenever filter criteria change
  useEffect(() => {
    const filtered = filterActions(allActions, timeValue, effortValue, selectedInterests)
    setFilteredActions(filtered)
  }, [allActions, timeValue, effortValue, selectedInterests])

  // Handler for time slider changes
  const handleTimeChange = (index: number) => {
    setTimeValue(TIME_OPTIONS[index])
  }

  // Handler for effort slider changes
  const handleEffortChange = (index: number) => {
    setEffortValue(EFFORT_OPTIONS[index])
  }

  // Handler for adding new interests from dropdown
  const handleInterestsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (value && !selectedInterests.includes(value)) {
      setSelectedInterests([...selectedInterests, value])
    }
  }

  // Handler for removing selected interests
  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter((i) => i !== interest))
  }

  return (
    <div className="min-h-screen bg-custom-bg">
      {/* Top banner with contact information for non-profits */}
      <HeaderBanner />
      
      {/* Main hero section with branding and funding info */}
      <HeroSection />
      
      {/* Interactive preferences and filtered actions display */}
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
      
      {/* Email signup form and footer */}
      <FooterSection
        emailAction={emailAction}
        isEmailPending={isEmailPending}
        emailState={emailState}
      />
    </div>
  )
}
