"use client"

import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push("/profile")
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn("google", {
        callbackUrl: "/profile",
        redirect: false,
      })
      
      if (result?.error) {
        console.error("Sign in error:", result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-custom-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to home link */}
        <Link href="/" className="inline-flex items-center gap-2 text-custom-green hover:text-custom-green/80 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-custom-green">Welcome to Grassroots KW</CardTitle>
            <CardDescription>
              Sign in to join climate actions in your community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-custom-green hover:bg-custom-green/90"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <Chrome className="h-5 w-5 mr-2" />
                  Continue with Google
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
