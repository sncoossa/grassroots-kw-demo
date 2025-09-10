"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export function ProfileHeader() {
  const { data: session } = useSession()

  return (
    <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Center - Page title */}
          <div className="text-center">
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>

          {/* Right side - Sign out */}
          <Button 
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
