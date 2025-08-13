"use server"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export interface EmailState {
  success: boolean
  message: string
}

export async function addEmailToWaitlist(_prevState: EmailState | null, formData: FormData): Promise<EmailState> {
  const email = formData.get("email") as string

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." }
  }

  try {
    const { error } = await supabase.from("waitlist_emails").insert([{ email }]).select()

    if (error) {
      if (error.code === "23505") {
        // Unique violation code
        return { success: false, message: "This email is already on the waitlist!" }
      }
      console.error("Error inserting email:", error)
      return { success: false, message: "Failed to add email to waitlist. Please try again." }
    }

    return { success: true, message: "Thanks for joining the waitlist!" }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}
