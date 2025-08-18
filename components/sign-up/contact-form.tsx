import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormData } from "./constants"
import { useSession } from "next-auth/react"
import { CheckCircle } from "lucide-react"

interface ContactFormProps {
  formData: FormData
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function ContactForm({ formData, onInputChange }: ContactFormProps) {
  const { data: session } = useSession()
  
  return (
    <Card className="bg-custom-bg border-custom-green/30">
      <CardHeader>
        <CardTitle className="text-custom-green font-instrument-serif">
          Contact Information
        </CardTitle>
        {session && (
          <p className="text-sm text-custom-green/70 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Information auto-filled from your profile
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-custom-green font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Enter your full name"
              className="border-custom-green/30 focus:border-custom-green"
              required
            />
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-custom-green font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="Enter your email address"
              className="border-custom-green/30 focus:border-custom-green"
              required
            />
          </div>

          {/* Phone field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-custom-green font-medium">
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={onInputChange}
              placeholder="Enter your phone number"
              className="border-custom-green/30 focus:border-custom-green"
            />
          </div>

          {/* Motivation field */}
          <div className="space-y-2">
            <Label htmlFor="motivation" className="text-custom-green font-medium">
              Why are you interested in climate action? *
            </Label>
            <Textarea
              id="motivation"
              name="motivation"
              value={formData.motivation}
              onChange={onInputChange}
              placeholder="Tell us about your motivation and what aspects of climate action interest you most..."
              className="border-custom-green/30 focus:border-custom-green min-h-[100px]"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
