import { NextResponse } from 'next/server'

export async function GET() {
  // Only allow in development to prevent exposing environment info in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ 
      error: 'Debug endpoint not available in production',
      timestamp: new Date().toISOString(),
      environment: 'production'
    }, { status: 403 })
  }

  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set ✅' : 'Missing ❌',
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set ✅' : 'Missing ❌',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set',
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set ✅' : 'Missing ❌',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set ✅' : 'Missing ❌',
    nodeEnv: process.env.NODE_ENV,
  })
}