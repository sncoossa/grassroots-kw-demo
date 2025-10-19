import { NextResponse } from 'next/server'

export async function GET() {
  // TEMPORARY: Log all environment variables to see what's available at runtime
  console.log('=== FULL PROCESS.ENV DUMP ===')
  console.log(JSON.stringify(process.env, null, 2))
  console.log('=== END PROCESS.ENV DUMP ===')
  
  // This endpoint helps diagnose AWS Amplify environment variable issues
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    platform: 'AWS Amplify',
    issue: 'Environment variables available at build time but not runtime',
    
    // Check each variable individually with detailed info
    variables: {
      // Supabase variables
      NEXT_PUBLIC_SUPABASE_URL: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        type: 'NEXT_PUBLIC (client-side)',
        value: process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 30)}...` : 'UNDEFINED',
        shouldWork: 'Yes - NEXT_PUBLIC vars are bundled at build time'
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        type: 'NEXT_PUBLIC (client-side)',
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 20)}...` : 'UNDEFINED',
        shouldWork: 'Yes - NEXT_PUBLIC vars are bundled at build time'
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        type: 'Server-side only',
        value: process.env.SUPABASE_SERVICE_ROLE_KEY ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 15)}...` : 'UNDEFINED',
        shouldWork: 'Only if Amplify runtime has access'
      },
      
      // NextAuth variables
      NEXTAUTH_URL: {
        exists: !!process.env.NEXTAUTH_URL,
        type: 'Server-side only',
        value: process.env.NEXTAUTH_URL || 'UNDEFINED',
        shouldWork: 'Only if Amplify runtime has access'
      },
      NEXTAUTH_SECRET: {
        exists: !!process.env.NEXTAUTH_SECRET,
        type: 'Server-side only',
        value: process.env.NEXTAUTH_SECRET ? `${process.env.NEXTAUTH_SECRET.slice(0, 10)}...` : 'UNDEFINED',
        shouldWork: 'Only if Amplify runtime has access'
      },
      GOOGLE_CLIENT_ID: {
        exists: !!process.env.GOOGLE_CLIENT_ID,
        type: 'Server-side only',
        value: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.slice(0, 20)}...` : 'UNDEFINED',
        shouldWork: 'Only if Amplify runtime has access'
      },
      GOOGLE_CLIENT_SECRET: {
        exists: !!process.env.GOOGLE_CLIENT_SECRET,
        type: 'Server-side only',
        value: process.env.GOOGLE_CLIENT_SECRET ? `${process.env.GOOGLE_CLIENT_SECRET.slice(0, 15)}...` : 'UNDEFINED',
        shouldWork: 'Only if Amplify runtime has access'
      }
    },
    
    // Environment info
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      platform_detection: {
        is_vercel: !!process.env.VERCEL,
        is_netlify: !!process.env.NETLIFY,
        is_aws: !!(process.env.AWS_REGION || process.env.AWS_EXECUTION_ENV),
        aws_region: process.env.AWS_REGION || 'not set',
        aws_execution_env: process.env.AWS_EXECUTION_ENV || 'not set'
      }
    },
    
    // Troubleshooting steps
    troubleshooting: {
      if_next_public_missing: "NEXT_PUBLIC vars should always work. Check Amplify Console Environment Variables.",
      if_server_vars_missing: "Server-side vars need to be set in Amplify Console AND properly configured for the runtime environment.",
      amplify_specific_issue: "Amplify sometimes needs variables to be re-saved or the app redeployed after adding them.",
      suggested_fix: "Try re-saving all environment variables in Amplify Console and redeploy"
    },
    
    // TEMPORARY: Show all environment variable names (values hidden for security)
    all_env_vars_available: Object.keys(process.env).sort(),
    env_vars_count: Object.keys(process.env).length
  }
  
  return NextResponse.json(diagnostics, { 
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  })
}