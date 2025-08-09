"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { profileService } from "@/lib/supabase"
import { toast } from "sonner"
import {
  ActionDetailsCard,
  ContactForm,
  AvailabilityGrid,
  SuccessMessage,
  DAYS_OF_WEEK,
  TIME_SLOTS,
  AvailabilitySlot,
  FormData,
  parseActionTimeToSlots,
  generateCalendarInvite
} from "@/components/sign-up"

/**
 * Indicate Your Interest Page
 * 
 * This page allows users to express interest in specific actions/events.
 * Users can sign up for actions they want to participate in by providing
 * their contact information and motivation.
 */
export default function IndicateInterestPage() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const actionTitle = searchParams.get('title') || ''
  const actionTime = searchParams.get('time') || ''
  const actionDate = searchParams.get('date') || ''
  const actionLocation = searchParams.get('location') || ''
  
  // Check if this is a scheduled event (has specific time)
  const isScheduledEvent = !!(actionTime && 
    actionTime !== 'TBD' && 
    actionTime !== 'To be determined' && 
    actionTime.toLowerCase() !== 'any' &&
    actionTime.toLowerCase() !== 'flexible' &&
    actionTime.toLowerCase() !== 'various')
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    motivation: ""
  })
  
  // Load user profile data when signed in
  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user?.id) {
        try {
          const profile = await profileService.getProfile(session.user.id)
          
          // Pre-fill form with available user data
          setFormData(prev => ({
            ...prev,
            name: session.user?.name || prev.name,
            email: session.user?.email || prev.email,
            phone: profile?.phone || prev.phone
          }))
        } catch (error) {
          console.error('Error loading user profile:', error)
          // Still pre-fill with session data if profile loading fails
          setFormData(prev => ({
            ...prev,
            name: session.user?.name || prev.name,
            email: session.user?.email || prev.email
          }))
        }
      }
    }

    if (session?.user) {
      loadUserData()
    }
  }, [session])
  
  // Initialize availability grid
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(() => {
    const slots: AvailabilitySlot[] = []
    const preSelectedTimeSlots = isScheduledEvent ? parseActionTimeToSlots(actionTime) : []
    
    DAYS_OF_WEEK.forEach(day => {
      TIME_SLOTS.forEach(timeSlot => {
        slots.push({
          day,
          timeSlot,
          isSelected: isScheduledEvent ? preSelectedTimeSlots.includes(timeSlot) : false
        })
      })
    })
    return slots
  })
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getSelectedAvailability = () => {
    return availability
      .filter(slot => slot.isSelected)
      .map(slot => `${slot.day} - ${slot.timeSlot}`)
      .join(', ')
  }

  const sendCalendarInvite = async () => {
    if (!isScheduledEvent) return
    
    const calendarUrl = generateCalendarInvite(actionTitle, actionDate, actionTime, actionLocation, formData)
    if (calendarUrl) {
      // Open the Google Calendar invite in a new window
      window.open(calendarUrl, '_blank')
      
      // Optionally, you could also send an email with the calendar invite
      // This would require a backend service to send emails
      console.log('Calendar invite generated:', calendarUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Get selected availability for submission
      const selectedAvailability = getSelectedAvailability()
      
      // Prepare form data for submission
      const submissionData = {
        ...formData,
        actionTitle,
        actionDate,
        actionTime,
        actionLocation,
        availability: selectedAvailability,
        isScheduledEvent
      }
      
      // Save to Supabase if user is authenticated
      if (session?.user?.id) {
        await profileService.createActionInterest({
          user_id: session.user.id,
          action_title: actionTitle,
          action_date: actionDate,
          action_time: actionTime,
          action_location: actionLocation,
          availability: selectedAvailability,
          motivation: formData.motivation,
          is_scheduled_event: isScheduledEvent
        })
        toast.success("Interest registered successfully!")
      } else {
        // Log the data for non-authenticated users (you might want to handle this differently)
        console.log('Form Data (non-authenticated):', submissionData)
        toast.success("Interest registered! Sign in to save your preferences.")
      }
      
      // For scheduled events, generate and open calendar invite
      if (isScheduledEvent) {
        await sendCalendarInvite()
      }
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error("Failed to register interest. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return <SuccessMessage isScheduledEvent={isScheduledEvent} />
  }

  return (
    <div className="min-h-screen bg-custom-bg">
      <div className="container mx-auto px-8 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="border-custom-green text-custom-green hover:bg-custom-green hover:text-custom-bg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Actions
              </Button>
            </Link>
          </div>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-4xl font-instrument-serif text-custom-green mb-4">
              Indicate Your Interest
            </h1>
            <ActionDetailsCard 
              actionTitle={actionTitle}
              actionDate={actionDate}
              actionTime={actionTime}
              actionLocation={actionLocation}
              isScheduledEvent={isScheduledEvent}
            />
            <p className="text-custom-green/80 text-lg">
              Thank you for your interest in participating in local climate action! 
              Please fill out the form below and we'll connect you with relevant opportunities.
            </p>
          </div>

          {/* Interest form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <ContactForm 
              formData={formData}
              onInputChange={handleInputChange}
            />

            {/* Availability grid */}
            <AvailabilityGrid 
              availability={availability}
              setAvailability={setAvailability}
              isScheduledEvent={isScheduledEvent}
            />

            {/* Submit button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-custom-green text-custom-bg hover:bg-custom-green/90 font-medium py-3"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Interest
                  {isScheduledEvent && ' & Add to Calendar'}
                </>
              )}
            </Button>
            
            {isScheduledEvent && (
              <p className="text-xs text-custom-green/60 text-center mt-2">
                📅 A Google Calendar invite will be created when you submit
              </p>
            )}
          </form>

          {/* Additional info */}
          <div className="mt-8 text-center">
            <p className="text-custom-green/60 text-sm">
              We respect your privacy and will only use this information to connect you with relevant climate action opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
