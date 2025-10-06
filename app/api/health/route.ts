import { NextResponse } from 'next/server'

export async function GET() {
  // This endpoint is safe for production - it doesn't expose sensitive information
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    services: {
      supabase: {
        url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        service_key_configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      auth: {
        nextauth_url: process.env.NEXTAUTH_URL || 'not set',
        nextauth_secret_configured: !!process.env.NEXTAUTH_SECRET,
        google_oauth_configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      }
    }
  }

  return NextResponse.json(healthCheck)
}