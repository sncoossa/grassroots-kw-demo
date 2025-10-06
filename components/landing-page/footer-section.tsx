"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2 } from "lucide-react"
import { type EmailState } from "@/app/actions"
import { useState, useEffect } from "react"
import { toast } from "sonner"

/**
 * Footer Section Component Props
 */
interface FooterSectionProps {
  emailAction: (formData: FormData) => void  // Server action for email submission
  isEmailPending: boolean                    // Loading state for form submission
  emailState: EmailState | null              // Result state from email submission
}

/**
 * Footer Section Component
 * 
 * Enhanced email signup component with:
 * - Client-side email validation
 * - Improved loading states and user feedback
 * - Better error handling and success messages
 * - Accessibility improvements
 * - Form reset after successful submission
 */
export function FooterSection({ emailAction, isEmailPending, emailState }: FooterSectionProps) {
  const [email, setEmail] = useState("")
  const [clientError, setClientError] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  // Handle email input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    
    // Clear previous client errors
    setClientError("")
    
    // Validate email format
    const isValid = validateEmail(newEmail)
    setIsValidEmail(isValid)
    
    // Show validation feedback only after user stops typing
    if (newEmail.length > 0 && !isValid) {
      setClientError("Please enter a valid email address")
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Don't submit if already pending
    if (isEmailPending) return
    
    // Client-side validation
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      const errorMsg = "Email address is required"
      setClientError(errorMsg)
      toast.error(errorMsg)
      return
    }
    
    if (!isValidEmail) {
      const errorMsg = "Please enter a valid email address"
      setClientError(errorMsg)
      toast.error(errorMsg)
      return
    }
    
    // Clear client errors and submit
    setClientError("")
    setHasSubmitted(true)
    
    // Show loading toast
    toast.loading("Adding you to our community...", {
      id: "email-submission"
    })
    
    // Create form data and submit
    const formData = new FormData()
    formData.append("email", trimmedEmail)
    emailAction(formData)
  }

  // Handle email submission results
  useEffect(() => {
    if (emailState && hasSubmitted) {
      // Dismiss loading toast
      toast.dismiss("email-submission")
      
      if (emailState.success) {
        // Show success toast
        toast.success("Welcome to the community! 🌱")
        
        // Reset form
        setEmail("")
        setIsValidEmail(false)
        setHasSubmitted(false)
        setClientError("")
      } else {
        // Show error toast
        toast.error(emailState.message)
        setHasSubmitted(false)
      }
    }
  }, [emailState, hasSubmitted])

  // Determine which error to show (client-side or server-side)
  const errorToShow = clientError || (emailState && !emailState.success ? emailState.message : "")
  const showSuccess = emailState?.success && hasSubmitted
  return (
    <div className="bg-custom-highlight py-16">
      <div className="container mx-auto px-8 text-center">
        {/* Call-to-action message */}
        <p className="mb-8 text-custom-green/80 font-switzer text-lg leading-5 tracking-tighter">
          We believe climate action shouldn&apos;t feel lonely or confusing. Enter your email below to join our growing community of local changemakers.
        </p>

        {/* Email signup form */}
        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4" noValidate>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="example@email.com"
                className="border-gray-300 text-xl font-instrument-serif focus:ring-2 focus:ring-custom-green/50 focus:border-custom-green transition-all duration-200"
                disabled={isEmailPending}
                required
                autoComplete="email"
                aria-label="Email address"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isEmailPending || !isValidEmail || !email.trim()}
              className="bg-custom-green px-8 text-lg hover:bg-custom-green/90 font-instrument-serif disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-custom-green/50 focus:ring-offset-2"
              aria-label={isEmailPending ? "Submitting email" : "Join waitlist"}
            >
              {isEmailPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                <>
                  join <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
          
          {/* Screen reader help text */}
          <div id="email-help" className="sr-only">
            Enter your email address to join our community of climate changemakers
          </div>
        </form>
        
        {/* Simple loading indicator */}
        {isEmailPending && (
          <div className="mt-4 flex items-center justify-center gap-2 text-custom-green/70">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm">Adding you to our waitlist...</p>
          </div>
        )}     
        {/* Organization branding */}
        <p className="mt-12 text-sm text-custom-green/60">
          Built by Grassroots KW. We&apos;re a small team trying to make a big impact.
        </p>

      </div>
      
    </div>
  )
}
