"use server"

import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Log configuration in development for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('[ACTIONS] Supabase config:', { 
    url: supabaseUrl ? 'Set' : 'Missing', 
    serviceKey: supabaseServiceRoleKey ? 'Set' : 'Missing' 
  })
}

// Function to create Supabase client with validation
function createSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  // Validate URL format
  if (!supabaseUrl.startsWith('http')) {
    throw new Error('Invalid Supabase URL format')
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

export interface EmailState {
  success: boolean
  message: string
}

export async function addEmailToWaitlist(_prevState: EmailState | null, formData: FormData): Promise<EmailState> {
  try {
    const email = formData.get("email") as string

    // Validate email input
    if (!email || !email.includes("@")) {
      return { success: false, message: "Please enter a valid email address." }
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Please enter a valid email address." }
    }

    // Log attempt in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[WAITLIST] Attempting to add email:', email)
    }

    // Check if environment variables are available BEFORE creating client
    if (!supabaseUrl) {
      console.error('[WAITLIST] Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
      return { success: false, message: "Service temporarily unavailable. Please try again later or contact support at info@grassrootskw.org." }
    }

    if (!supabaseServiceRoleKey) {
      console.error('[WAITLIST] Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
      return { success: false, message: "Service temporarily unavailable. Please try again later or contact support at info@grassrootskw.org." }
    }

    // Create Supabase client with error handling
    let supabase
    try {
      supabase = createSupabaseClient()
    } catch (clientError) {
      console.error('[WAITLIST] Failed to create Supabase client:', clientError)
      return { success: false, message: "Service temporarily unavailable. Please try again later or contact support at info@grassrootskw.org." }
    }

    // Attempt database operation
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
    // Enhanced error logging with more details
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    const errorStack = err instanceof Error ? err.stack : 'No stack trace'
    
    console.error('[WAITLIST] Unexpected error:', {
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : 'Stack trace omitted in production',
      timestamp: new Date().toISOString()
    })
    
    // Return a user-friendly message regardless of the error
    return { 
      success: false, 
      message: "We're experiencing technical difficulties. Please try again in a few moments or contact support at info@grassrootskw.org." 
    }
  }
}
