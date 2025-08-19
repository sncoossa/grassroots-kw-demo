import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { type EmailState } from "@/app/actions"

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
 * The bottom section of the landing page containing:
 * - Call-to-action message for email signup
 * - Email input form with submit button
 * - Form submission feedback (success/error messages)
 * - Organization attribution and branding
 * 
 * Uses React Server Actions for form handling and provides
 * real-time feedback on submission status.
 */
export function FooterSection({ emailAction, isEmailPending, emailState }: FooterSectionProps) {
  return (
    <div className="bg-custom-highlight py-16">
      <div className="container mx-auto px-8 text-center">
        {/* Call-to-action message */}
        <p className="mb-8 text-custom-green/80">

          We believe climate action shouldn&apos;t feel lonely or confusing. Enter your email below to join our growing community of local changemakers.

        </p>

        {/* Email signup form */}
        <form action={emailAction} className="mx-auto flex max-w-md gap-2">
          <Input
            type="email"
            name="email"
            placeholder="example@email.com"
            className="flex-1 border-gray-300 text-xl font-instrument-serif"
            required
          />
          <Button
            type="submit"
            disabled={isEmailPending}
            className="bg-custom-green px-8 text-lg hover:bg-custom-green/90 font-instrument-serif"
          >
            {isEmailPending ? "Submitting..." : "join"} <ArrowRight className="ml-2 h-4 w-4" />

          </Button>
        </form>
        
        {/* Form submission feedback */}
        {emailState && (
          <p className={`mt-4 text-sm ${emailState.success ? "text-green-600" : "text-red-600"}`}>
            {emailState.message}
          </p>
        )}     
        {/* Organization branding */}
        <p className="mt-12 text-sm text-custom-green/60">
          Built by Grassroots KW. We&apos;re a small team trying to make a big impact.
        </p>

      </div>
      
    </div>
  )
}
