import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin, supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    // Environment info for debugging
    if (process.env.NODE_ENV === 'development') {
      logger.log('Profile API GET - Environment:', config.getEnvironmentInfo())
    }
    
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile using admin client for better reliability
    const client = supabaseAdmin || supabase
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching profile:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data })

  } catch (error) {
    console.error('Profile API GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Environment info for debugging
    if (process.env.NODE_ENV === 'development') {
      logger.log('Profile API POST - Environment:', config.getEnvironmentInfo())
    }
    
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile data from request
    const profileData = await request.json()
    
    const upsertData = {
      user_id: session.user.id,
      ...profileData,
      updated_at: new Date().toISOString()
    }

    logger.log('API: Upserting profile data', { userId: session.user.id, upsertedFields: Object.keys(upsertData) })

    // Use admin client for upsert operations to bypass RLS issues
    const client = supabaseAdmin || supabase
    const { data, error } = await client
      .from('user_profiles')
      .upsert(upsertData, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('API: Profile upsert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        usingAdmin: !!supabaseAdmin,
        fullError: error
      })
      return NextResponse.json({ 
        error: `Profile upsert failed: ${error.message || error.code || 'Unknown error'}` 
      }, { status: 500 })
    }

    logger.log('API: Profile upsert successful:', data)
    return NextResponse.json({ profile: data })

  } catch (error) {
    console.error('Profile API POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
