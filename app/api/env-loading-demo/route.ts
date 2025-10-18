import { NextResponse } from 'next/server'

export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production'
  
  // This demonstrates EXACTLY how Next.js loads environment variables
  const envLoadingDemo = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    
    // 1. NEXT_PUBLIC_ variables - Available EVERYWHERE (client + server)
    clientSideVariables: {
      explanation: "NEXT_PUBLIC_ variables are embedded into the client bundle at BUILD TIME",
      loadedAt: "Build time - bundled into JavaScript",
      availableOn: "Both client and server",
      security: "⚠️  EXPOSED to browser - never put secrets here",
      examples: {
        NEXT_PUBLIC_SUPABASE_URL: {
          value: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
          length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
          preview: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + "..." || "NOT_SET"
        },
        NEXT_PUBLIC_SUPABASE_ANON_KEY: {
          value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
          length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
        }
      }
    },

    // 2. Server-only variables - Only available on server
    serverSideVariables: {
      explanation: "Regular env vars are ONLY available on the server at RUNTIME",
      loadedAt: isProduction ? "Runtime from hosting environment" : "Runtime from .env files",
      availableOn: "Server only (API routes, Server Components, Server Actions)",
      security: "✅ Safe for secrets - never sent to client",
      examples: {
        NEXTAUTH_SECRET: {
          value: process.env.NEXTAUTH_SECRET ? "SET" : "MISSING",
          length: process.env.NEXTAUTH_SECRET?.length || 0,
          source: isProduction ? "Amplify Console Environment Variables" : ".env.local file"
        },
        NEXTAUTH_URL: {
          value: process.env.NEXTAUTH_URL || "NOT_SET",
          source: isProduction ? "Amplify Console Environment Variables" : ".env.local file"
        },
        GOOGLE_CLIENT_ID: {
          value: process.env.GOOGLE_CLIENT_ID ? "SET" : "MISSING",
          length: process.env.GOOGLE_CLIENT_ID?.length || 0,
          source: isProduction ? "Amplify Console Environment Variables" : ".env.local file"
        },
        GOOGLE_CLIENT_SECRET: {
          value: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING",
          length: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
          source: isProduction ? "Amplify Console Environment Variables" : ".env.local file"
        },
        SUPABASE_SERVICE_ROLE_KEY: {
          value: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING",
          length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
          source: isProduction ? "Amplify Console Environment Variables" : ".env.local file"
        }
      }
    },

    // 3. How AWS Amplify handles environment variables
    amplifySpecifics: {
      explanation: "AWS Amplify has specific behavior for environment variables",
      buildTime: {
        when: "During 'pnpm run build'",
        source: "Amplify Console Environment Variables + amplify.yml",
        behavior: "Variables are available to the build process",
        note: "This is when NEXT_PUBLIC_ vars are bundled into client code"
      },
      runtime: {
        when: "When your app is running and serving requests",
        source: "Only Amplify Console Environment Variables (NOT amplify.yml)",
        behavior: "Server-side variables must be available from the hosting environment",
        criticalNote: "❗ amplify.yml variables do NOT carry over to runtime"
      }
    },

    // 4. Common issues and debugging
    commonIssues: {
      issue1: {
        problem: "Variables show as SET during build but MISSING at runtime",
        cause: "Variable set in amplify.yml but not in Amplify Console",
        solution: "Set ALL variables in Amplify Console > App Settings > Environment Variables"
      },
      issue2: {
        problem: "NEXT_PUBLIC_ variables are undefined on client",
        cause: "Variable not set during build time or wrong naming",
        solution: "Ensure variable is set in Amplify Console with exact NEXT_PUBLIC_ prefix"
      },
      issue3: {
        problem: "Server actions fail with 'undefined' environment variables",
        cause: "Server-side variables not available at runtime",
        solution: "Check Amplify Console environment variables are set for the correct branch"
      }
    },

    // 5. Load order and precedence
    loadOrder: {
      development: [
        "1. .env.development.local",
        "2. .env.local", 
        "3. .env.development",
        "4. .env"
      ],
      production: [
        "1. Amplify Console Environment Variables (highest priority)",
        "2. amplify.yml environment section (build time only)",
        "3. Default values in code"
      ]
    }
  }

  return NextResponse.json(envLoadingDemo, { 
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  })
}