import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface SuccessMessageProps {
  isScheduledEvent: boolean
}

export function SuccessMessage({ isScheduledEvent }: SuccessMessageProps) {
  return (
    <div className="min-h-screen bg-custom-bg">
      <div className="container mx-auto px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-custom-green mx-auto mb-4" />
            <h1 className="text-4xl font-instrument-serif text-custom-green mb-4">
              Thank You!
            </h1>
            <p className="text-custom-green/80 text-lg mb-6">
              Your interest has been recorded successfully. We'll be in touch soon with more details about upcoming climate actions.
              {isScheduledEvent && (
                <span className="block mt-2 text-sm">
                  📅 A Google Calendar invite should have opened in a new tab. If not, please check your pop-up blocker settings.
                </span>
              )}
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/">
              <Button className="bg-custom-green text-custom-bg hover:bg-custom-green/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
