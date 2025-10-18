import { NextResponse } from 'next/server'

export async function GET() {
  // More detailed environment variable debugging
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    // Supabase variables
    NEXT_PUBLIC_SUPABASE_URL: {
      exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      preview: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 20) + '...' || 'NOT_SET'
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      preview: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10) + '...' || 'NOT_SET'
    },
    // NextAuth variables
    NEXTAUTH_URL: {
      exists: !!process.env.NEXTAUTH_URL,
      value: process.env.NEXTAUTH_URL || 'NOT_SET'
    },
    NEXTAUTH_SECRET: {
      exists: !!process.env.NEXTAUTH_SECRET,
      length: process.env.NEXTAUTH_SECRET?.length || 0
    },
    GOOGLE_CLIENT_ID: {
      exists: !!process.env.GOOGLE_CLIENT_ID,
      length: process.env.GOOGLE_CLIENT_ID?.length || 0
    },
    GOOGLE_CLIENT_SECRET: {
      exists: !!process.env.GOOGLE_CLIENT_SECRET,
      length: process.env.GOOGLE_CLIENT_SECRET?.length || 0
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    runtime: 'Next.js API Route',
    envVars
  })
}