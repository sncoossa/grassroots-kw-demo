import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { addEmailToWaitlist, type EmailState } from "@/app/actions"

interface FooterSectionProps {
  emailAction: (formData: FormData) => void
  isEmailPending: boolean
  emailState: EmailState | null
}

export function FooterSection({ emailAction, isEmailPending, emailState }: FooterSectionProps) {
  return (
    <div className="bg-custom-highlight py-16">
      <div className="container mx-auto px-8 text-center">
        <p className="mb-8 text-custom-green/80">
          We believe climate action shouldn't feel lonely or confusing. Enter your email below to join our growing community of local changemakers.
        </p>

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
        {emailState && (
          <p className={`mt-4 text-sm ${emailState.success ? "text-green-600" : "text-red-600"}`}>
            {emailState.message}
          </p>
        )}
       
      </div>

       <div className="bg-custom-green p-4 rounded/80 py-3 px-4 text-center text-sm text-custom-highlight border-b border-custom-green/20">
          Built by Grassroots KW. We're a small team trying to make a big impact.
        </div>
      
    </div>
  )
}
