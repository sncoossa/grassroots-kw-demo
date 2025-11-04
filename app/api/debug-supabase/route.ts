import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  logger.log('Debug Supabase endpoint called', { supabaseUrlPresent: !!supabaseUrl, anonKeyPresent: !!supabaseAnonKey, serviceKeyPresent: !!supabaseServiceKey })

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_SUPABASE_URL not set on server' }, { status: 500 })
  }

  const result: Record<string, any> = {
    supabaseUrlPresent: !!supabaseUrl,
    anonKeyPresent: !!supabaseAnonKey,
    serviceKeyPresent: !!supabaseServiceKey,
    checks: {}
  }

  // 1) Basic fetch to the Supabase root URL to detect DNS/connection/TLS issues
  try {
    const t0 = Date.now()
    const res = await fetch(supabaseUrl, { method: 'GET' })
    result.checks.rootFetch = { status: res.status, statusText: res.statusText, elapsedMs: Date.now() - t0 }
  } catch (err) {
    result.checks.rootFetchError = String(err instanceof Error ? err.message : err)
    logger.error('debug-supabase: root fetch failed', { error: err })
  }

  // 2) If a service role key exists, try a harmless, read-only query using the client
  if (supabaseServiceKey) {
    try {
      const client = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })

      // Try selecting a single row (non-destructive). If your table names differ, this will fail safely.
      const { data, error } = await client.from('user_profiles').select('id').limit(1)
      if (error) {
        result.checks.serviceQueryError = { message: error.message, code: error.code }
        logger.error('debug-supabase: service query returned error', { error })
      } else {
        result.checks.serviceQuery = { rowsReturned: Array.isArray(data) ? data.length : (data ? 1 : 0) }
        logger.log('debug-supabase: service query succeeded', { rows: result.checks.serviceQuery.rowsReturned })
      }
    } catch (err) {
      result.checks.serviceQueryException = String(err instanceof Error ? err.message : err)
      logger.error('debug-supabase: service client exception', { error: err })
    }
  } else {
    result.checks.serviceQuery = 'skipped (no SUPABASE_SERVICE_ROLE_KEY set)'
  }

  return NextResponse.json(result)
}
