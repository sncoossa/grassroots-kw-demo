import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EventForm() {
  return (
    <div className="container mx-auto px-8 py-16 text-center flex flex-col items-center bg-custom-bg rounded">
      <div className="flex flex-col items-center mb-4">
      <div className="flex items-center justify-center gap-2 text-sm"></div>       
      </div>
      <h3 className="mb-6 text-lg font-instrument-serif tracking-tighter text-custom-green">Running a climate initiative in KW?</h3>
      <div className="mb-8 space-y-1">
      <p className="text-lg tracking-tight text-custom-green/80">We know it's hard to get the word out.</p>.
      <p className="text-lg tracking-tight text-custom-green/80">We're here to support you.</p>
      </div>
      <Button
      asChild
      className="bg-custom-green px-8 text-lg hover:bg-custom-green/90 font-instrument-serif"
      >
      <a href="https://tally.so/r/nrZLyR"
        target="_blank"
        rel="noopener noreferrer">
        submit your event details
        <ArrowRight className="ml-2 h-4 w-4" />
      </a>
      </Button>
    </div>
  )
}
