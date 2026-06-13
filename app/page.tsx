"use client"

import type React from "react"

import { useActionState } from "react" // Import useActionState for form handling
import { addEmailToWaitlist, type EmailState } from "@/app/actions" // Import the Server Action
import { HeroSection } from "@/components/landing-page/hero-section"
import { EventForm } from "@/components/landing-page/event-form"
import { FooterSection } from "@/components/landing-page/footer-section"

/**
 * Main landing page component for Grassroots KW
 * Manages application state and coordinates all child components
 */
export default function GrassrootsKW() {
  // Email waitlist form state using useActionState hook
  const [emailState, emailAction, isEmailPending] = useActionState<EmailState, FormData>(addEmailToWaitlist, {
    success: false,
    message: "",
  })

  return (
    <div className="min-h-screen bg-custom-bg">
      {/* Main hero section with branding and funding info */}
      <HeroSection />
      
      {/* Interactive preferences and filtered actions display
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
      /> */}
      {/*Event Form Component*/}
      <EventForm />
      
      {/*EFooter for Email Signup*/}
      <FooterSection
        emailAction={emailAction}
        isEmailPending={isEmailPending}
        emailState={emailState}
      />
    </div>
  )
}
