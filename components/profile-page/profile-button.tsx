import Link from "next/link"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Profile Button Component
 * 
 * A button component that navigates to the user profile page.
 * Positioned in the top right corner of the homepage.
 * Uses the User icon from Lucide React for visual consistency.
 */
export function ProfileButton() {
  return (
    <Link href="/profile">
      <Button
        size="sm"
        className="bg-custom-green text-custom-bg hover:bg-custom-green/90 transition-colors rounded-full p-1.5 w-8 h-8 flex items-center justify-center"
      >
        <User className="h-3.5 w-3.5" />
      </Button>
    </Link>
  )
}
