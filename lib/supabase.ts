import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[SUPABASE] Missing required environment variables:', {
    url: supabaseUrl ? 'Set' : 'Missing NEXT_PUBLIC_SUPABASE_URL',
    key: supabaseAnonKey ? 'Set' : 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY'
  })
}

// Only log configuration in development to avoid exposing sensitive info in production
if (process.env.NODE_ENV === 'development') {
  logger.log('Supabase config:', { 
    url: supabaseUrl || 'Missing', 
    keyPreview: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'Missing'
  })
}

// Main client for general operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for storage operations (server-side only)
// Note: This will only work on the server side where SUPABASE_SERVICE_ROLE_KEY is available
let supabaseAdmin: ReturnType<typeof createClient> | null = null

if (typeof window === 'undefined') {
  // Server-side only
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
}

export { supabaseAdmin }

// Type definitions for our custom tables
export interface UserProfile {
  id: string
  user_id: string // Changed from uuid to string to match JWT token
  pronouns?: string
  phone?: string
  bio?: string
  profile_image?: string
  created_at: string
  updated_at: string
}

export interface ActionInterest {
  id: string
  user_id: string // Changed from uuid to string to match JWT token
  action_title: string
  action_date?: string
  action_time?: string
  action_location?: string
  availability?: string
  motivation?: string
  is_scheduled_event: boolean
  created_at: string
}

// Helper functions for user profile management
export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      
      if (error) {
        console.error('Profile query error:', {
          message: error.message,
          code: error.code
        })
        return null
      }
      
      return data
    } catch (error) {
      console.error('Unexpected error in getProfile:', error)
      return null
    }
  },

  async upsertProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const upsertData = {
        user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }
      
            logger.log('Upserting profile data:', { userId, updatedFields: Object.keys(profileData) })
      
      // Use service role client for upsert operations to bypass RLS issues
      const client = supabaseAdmin || supabase
      const { data, error } = await client
        .from('user_profiles')
        .upsert(upsertData, {
          onConflict: 'user_id'
        })
        .select()
        .single()
      
      if (error) {
        // Inspect error to provide a clearer message for network/fetch failures
        const rawMessage = (error && (error.message || error.code)) || 'Unknown error'
        const isFetchFailed = typeof rawMessage === 'string' && rawMessage.toLowerCase().includes('fetch failed')

        console.error('Profile upsert error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          usingAdmin: !!supabaseAdmin,
          fullError: error
        })

        const userFriendly = isFetchFailed
          ? 'Network error: failed to contact Supabase (fetch failed)'
          : rawMessage

        // Throw a message that the calling code/API route can surface to the user.
        throw new Error(`Profile upsert failed: ${userFriendly}`)
      }
      
      logger.log('Profile upsert successful:', data)
      return data
    } catch (error) {
      console.error('Unexpected error in upsertProfile:', error)
      // Re-throw the error instead of returning null so the calling code can handle it
      throw error
    }
  },

  async createActionInterest(interestData: Omit<ActionInterest, 'id' | 'created_at'>): Promise<ActionInterest | null> {
    // For now, we'll store this data directly since we're not using the adapter
    // In a production app, you might want to ensure the user exists first
    const { data, error } = await supabase
      .from('action_interests')
      .insert(interestData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating action interest:', error)
      return null
    }
    
    return data
  },

  async getUserActionInterests(userId: string): Promise<ActionInterest[]> {
    const { data, error } = await supabase
      .from('action_interests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching action interests:', error)
      return []
    }
    
    return data || []
  }
}
