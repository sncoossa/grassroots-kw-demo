import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase config:', { 
  url: supabaseUrl, 
  keyPreview: supabaseAnonKey.substring(0, 20) + '...' 
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
      console.log('=== Profile fetch attempt ===')
      console.log('User ID:', userId, 'Type:', typeof userId)
      
      // Try the actual query with better error logging
      console.log('Attempting profile query...')
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      
      console.log('Profile query result:', { data, error })
      
      if (error) {
        console.error('Profile query error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return null
      }
      
      console.log('Profile fetch completed:', data)
      return data
    } catch (error) {
      console.error('Unexpected error in getProfile:', error)
      return null
    }
  },

  async upsertProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      console.log('=== Profile upsert attempt ===')
      console.log('User ID:', userId, 'Type:', typeof userId)
      console.log('Profile data:', profileData)
      
      const upsertData = {
        user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }
      console.log('Upsert data:', JSON.stringify(upsertData, null, 2))
      
      // Check if the table exists and is accessible
      console.log('Testing table access...')
      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1)
      
      console.log('Table access test:', { testData, testError })
      
      if (testError) {
        console.error('Table access error:', {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code
        })
        throw new Error(`Cannot access user_profiles table: ${testError.message}`)
      }
      
      console.log('Performing upsert...')
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(upsertData, {
          onConflict: 'user_id'
        })
        .select()
        .single()
      
      console.log('Upsert result:', { data, error })
      
      if (error) {
        console.error('Profile upsert error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: JSON.stringify(error, null, 2)
        })
        console.error('Raw error object:', error)
        console.error('Error stringified:', JSON.stringify(error))
        throw new Error(`Profile upsert failed: ${error.message || 'Unknown error'}`)
      }
      
      console.log('Profile upsert completed:', data)
      return data
    } catch (error) {
      console.error('Unexpected error in upsertProfile:', error)
      return null
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
