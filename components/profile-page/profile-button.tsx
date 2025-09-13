"use client"

import Link from "next/link"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { profileService } from "@/lib/supabase"

/**
 * Profile Button Component
 * 
 * A button component that navigates to the user profile page if signed in,
 * or to the sign-in page if not authenticated.
 * Positioned in the top right corner of the homepage.
 */
export function ProfileButton() {
  const { data: session, status } = useSession()
  const [profileImage, setProfileImage] = useState<string>("")

  // Load custom profile image when user is signed in
  useEffect(() => {
    const loadProfileImage = async () => {
      if (session?.user?.id) {
        try {
          const profile = await profileService.getProfile(session.user.id)
          if (profile?.profile_image) {
            setProfileImage(profile.profile_image)
          }
        } catch (error) {
          console.error('Error loading profile image:', error)
        }
      }
    }

    if (session?.user?.id) {
      loadProfileImage()
    }
  }, [session?.user?.id])

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-custom-green/20 animate-pulse" />
    )
  }

  if (session) {
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    // Use custom profile image if available, otherwise fall back to Google OAuth image
    const imageSource = profileImage || session.user?.image || ""

    return (
      <Link href="/profile">
        <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-custom-green/50 transition-all">
          <AvatarImage src={imageSource} alt={session.user?.name || ""} />
          <AvatarFallback className="bg-custom-green text-white text-xs">
            {getInitials(session.user?.name || "U")}
          </AvatarFallback>
        </Avatar>
      </Link>
    )
  }

  return (
    <Link href="/auth/signin">
      <Button
        size="sm"
        className="bg-custom-green text-custom-bg hover:bg-custom-green/90 transition-colors rounded-full p-1.5 w-8 h-8 flex items-center justify-center"
      >
        <LogIn className="h-3.5 w-3.5" />
      </Button>
    </Link>
  )
}
