# Grassroots KW - Environment Variables Setup Guide

Write-Host "=== Grassroots KW - Environment Variables Setup Guide ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 You need to set these environment variables in AWS Amplify Console:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://console.aws.amazon.com/amplify/"
Write-Host "2. Select your 'grassroots-kw-demo' app"
Write-Host "3. Click 'App Settings' > 'Environment Variables'"
Write-Host "4. Add these variables:"
Write-Host ""
Write-Host "┌─────────────────────────────────┬─────────────────────────────────────────┐"
Write-Host "│ Variable Name                   │ Description                             │"
Write-Host "├─────────────────────────────────┼─────────────────────────────────────────┤"
Write-Host "│ NEXTAUTH_SECRET                 │ Random 32+ character string             │"
Write-Host "│ GOOGLE_CLIENT_ID                │ From Google Cloud Console               │"
Write-Host "│ GOOGLE_CLIENT_SECRET            │ From Google Cloud Console               │"
Write-Host "│ NEXT_PUBLIC_SUPABASE_URL        │ From Supabase Dashboard > Settings      │"
Write-Host "│ NEXT_PUBLIC_SUPABASE_ANON_KEY   │ From Supabase Dashboard > API           │"
Write-Host "│ SUPABASE_SERVICE_ROLE_KEY       │ From Supabase Dashboard > API (secret)  │"
Write-Host "└─────────────────────────────────┴─────────────────────────────────────────┘"
Write-Host ""
Write-Host "🔐 To generate NEXTAUTH_SECRET:" -ForegroundColor Green
Write-Host "   PowerShell: [System.Convert]::ToBase64String((1..32 | ForEach {Get-Random -Maximum 256}))"
Write-Host "   Or visit: https://generate-secret.vercel.app/32"
Write-Host ""
Write-Host "🔗 Google OAuth Setup:" -ForegroundColor Blue
Write-Host "   1. Go to: https://console.cloud.google.com/"
Write-Host "   2. Create/Select project > APIs & Services > Credentials"
Write-Host "   3. Create OAuth 2.0 Client ID"
Write-Host "   4. Add authorized redirect URI: https://grassrootskw.org/api/auth/callback/google"
Write-Host ""
Write-Host "🗄️  Supabase Values:" -ForegroundColor Magenta
Write-Host "   1. Go to: https://supabase.com/dashboard"
Write-Host "   2. Select your project"
Write-Host "   3. Settings > API > Copy the values"
Write-Host ""
Write-Host "💡 After adding variables in Amplify Console:" -ForegroundColor Yellow
Write-Host "   1. Go to your app in Amplify Console"
Write-Host "   2. Click 'Redeploy this version' or push new code"
Write-Host "   3. Check build logs to verify variables are loaded"
Write-Host ""

# Check current local environment status
Write-Host "📋 Current local environment status:" -ForegroundColor Cyan
Write-Host ""

function Check-EnvVar($varName) {
    $value = [Environment]::GetEnvironmentVariable($varName)
    if ([string]::IsNullOrEmpty($value)) {
        Write-Host "   $varName`: ❌ MISSING" -ForegroundColor Red
    } else {
        Write-Host "   $varName`: ✅ SET" -ForegroundColor Green
    }
}

Check-EnvVar "NEXTAUTH_SECRET"
Check-EnvVar "GOOGLE_CLIENT_ID"
Check-EnvVar "GOOGLE_CLIENT_SECRET"
Check-EnvVar "NEXT_PUBLIC_SUPABASE_URL"
Check-EnvVar "NEXT_PUBLIC_SUPABASE_ANON_KEY"
Check-EnvVar "SUPABASE_SERVICE_ROLE_KEY"

Write-Host ""
Write-Host "✅ Once all variables are set, your app should work in production!" -ForegroundColor Green

# Generate a sample NEXTAUTH_SECRET
Write-Host ""
Write-Host "🎲 Sample NEXTAUTH_SECRET (you can use this):" -ForegroundColor Yellow
$secret = [System.Convert]::ToBase64String((1..32 | ForEach {Get-Random -Maximum 256}))
Write-Host "   $secret" -ForegroundColor White