"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileHeader } from "@/components/profile-page/profile-header"
import { ProfileForm } from "@/components/profile-page/profile-form"

/**
 * Profile Page Component
 * 
 * User profile page for managing account settings and preferences.
 * This page will be developed further with user-specific functionality.
 */
export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-custom-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-green" />
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-custom-bg">
      <ProfileHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ProfileForm />
      </main>
    </div>
  )
}
