#!/bin/bash

echo "=== Grassroots KW - Environment Variables Setup Guide ==="
echo ""
echo "🔧 You need to set these environment variables in AWS Amplify Console:"
echo ""
echo "1. Go to: https://console.aws.amazon.com/amplify/"
echo "2. Select your 'grassroots-kw-demo' app"
echo "3. Click 'App Settings' > 'Environment Variables'"
echo "4. Add these variables:"
echo ""
echo "┌─────────────────────────────────┬─────────────────────────────────────────┐"
echo "│ Variable Name                   │ Description                             │"
echo "├─────────────────────────────────┼─────────────────────────────────────────┤"
echo "│ NEXTAUTH_SECRET                 │ Random 32+ character string             │"
echo "│ GOOGLE_CLIENT_ID                │ From Google Cloud Console               │"
echo "│ GOOGLE_CLIENT_SECRET            │ From Google Cloud Console               │"
echo "│ NEXT_PUBLIC_SUPABASE_URL        │ From Supabase Dashboard > Settings      │"
echo "│ NEXT_PUBLIC_SUPABASE_ANON_KEY   │ From Supabase Dashboard > API           │"
echo "│ SUPABASE_SERVICE_ROLE_KEY       │ From Supabase Dashboard > API (secret)  │"
echo "└─────────────────────────────────┴─────────────────────────────────────────┘"
echo ""
echo "🔐 To generate NEXTAUTH_SECRET:"
echo "   Run: openssl rand -base64 32"
echo "   Or visit: https://generate-secret.vercel.app/32"
echo ""
echo "🔗 Google OAuth Setup:"
echo "   1. Go to: https://console.cloud.google.com/"
echo "   2. Create/Select project > APIs & Services > Credentials"
echo "   3. Create OAuth 2.0 Client ID"
echo "   4. Add authorized redirect URI: https://grassrootskw.org/api/auth/callback/google"
echo ""
echo "🗄️  Supabase Values:"
echo "   1. Go to: https://supabase.com/dashboard"
echo "   2. Select your project"
echo "   3. Settings > API > Copy the values"
echo ""
echo "💡 After adding variables in Amplify Console:"
echo "   1. Go to your app in Amplify Console"
echo "   2. Click 'Redeploy this version' or push new code"
echo "   3. Check build logs to verify variables are loaded"
echo ""

# If running locally, also show current local environment status
if [ -f ".env.local" ] || [ -f ".env" ]; then
    echo "📋 Current local environment status:"
    echo ""
    
    check_var() {
        if [ -n "${!1}" ]; then
            echo "   $1: ✅ SET"
        else
            echo "   $1: ❌ MISSING"
        fi
    }
    
    check_var "NEXTAUTH_SECRET"
    check_var "GOOGLE_CLIENT_ID" 
    check_var "GOOGLE_CLIENT_SECRET"
    check_var "NEXT_PUBLIC_SUPABASE_URL"
    check_var "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    check_var "SUPABASE_SERVICE_ROLE_KEY"
    echo ""
fi

echo "✅ Once all variables are set, your app should work in production!"