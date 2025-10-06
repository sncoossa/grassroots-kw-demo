"use server"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client for server-side operations
// Use NEXT_PUBLIC_SUPABASE_URL for consistency with client-side config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Log configuration in development for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase config:', { 
    url: supabaseUrl ? 'Set' : 'Missing', 
    serviceKey: supabaseServiceRoleKey ? 'Set' : 'Missing' 
  })
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export interface EmailState {
  success: boolean
  message: string
}

export async function addEmailToWaitlist(_prevState: EmailState | null, formData: FormData): Promise<EmailState> {
  const email = formData.get("email") as string

  // Validate email input
  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." }
  }

  // Check if environment variables are available
  if (!supabaseUrl) {
    console.error('[WAITLIST] Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    return { success: false, message: "Service configuration error: Missing database URL. Please contact support at info@grassrootskw.org." }
  }

  if (!supabaseServiceRoleKey) {
    console.error('[WAITLIST] Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
    return { success: false, message: "Service configuration error: Missing service key. Please contact support at info@grassrootskw.org." }
  }

  try {
    // Log attempt in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[WAITLIST] Attempting to add email:', email)
    }

    const { error, data } = await supabase.from("waitlist_emails").insert([{ email }]).select()

    if (error) {
      // Log the actual error for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('[WAITLIST] Supabase error:', error)
      } else {
        // In production, log to server but don't expose details to client
        console.error('[WAITLIST] Database error:', { code: error.code, message: error.message })
      }

      if (error.code === "23505") {
        // Unique violation code
        return { success: false, message: "This email is already on the waitlist!" }
      }
      if (error.code === "42501") {
        // RLS policy violation
        return { success: false, message: "Database access error. Please contact support at info@grassrootskw.org." }
      }
      if (error.code === "42P01") {
        // Table does not exist
        return { success: false, message: "Database table not found. Please contact support at info@grassrootskw.org." }
      }
      
      return { success: false, message: `Failed to add email to waitlist. Error code: ${error.code}. Please contact support at info@grassrootskw.org.` }
    }

    // Log success in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[WAITLIST] Successfully added email:', data)
    }

    return { success: true, message: "Thanks for joining the waitlist!" }
  } catch (err) {
    // Enhanced error logging
    console.error('[WAITLIST] Unexpected error:', err)
    return { success: false, message: "An unexpected error occurred. Please contact support at info@grassrootskw.org." }
  }
}
