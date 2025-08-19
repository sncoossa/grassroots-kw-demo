# Environment Configuration for Production (grassrootskw.org)

## Required Environment Variables

### NextAuth Configuration
```bash
# Production URL - automatically detected or set explicitly
NEXTAUTH_URL=https://grassrootskw.org
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Supabase Configuration
```bash
# Public Supabase URL (same for all environments)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url

# Public anon key (same for all environments)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Service role key (CRITICAL: Server-side only, never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Environment Detection

The application automatically detects the environment and configures URLs accordingly:

### Development (localhost)
- Base URL: `http://localhost:3000` (or custom PORT)
- API routes: Relative URLs (`/api/profile`, `/api/upload-image`)
- NextAuth callbacks: Auto-configured for localhost

### Production (grassrootskw.org)
- Base URL: `https://grassrootskw.org` (or from NEXTAUTH_URL)
- API routes: Same relative URLs work automatically
- NextAuth callbacks: Auto-configured for production domain

## API Route Compatibility

✅ **Profile API** (`/api/profile`):
- GET: Fetch user profile with session authentication
- POST: Save/update profile using service role authentication
- Environment-agnostic: Works on localhost and grassrootskw.org

✅ **Image Upload API** (`/api/upload-image`):
- POST: Upload profile images to Supabase Storage
- Secure: Uses service role for storage operations
- Environment-agnostic: Relative URLs ensure compatibility

## Testing Checklist

### Localhost Testing:
1. Profile loading ✅
2. Profile saving (name, pronouns, phone, bio) ✅
3. Image upload ✅
4. Auto-save after image upload ✅

### Production Testing:
1. Profile loading ✅
2. Profile saving (name, pronouns, phone, bio) ✅
3. Image upload ✅
4. Auto-save after image upload ✅
5. Google OAuth callback works ✅
6. Session persistence ✅

## Security Notes

- Service role key is only used server-side in API routes
- All database operations go through authenticated API endpoints
- RLS policies provide additional security layer
- Image uploads use unique filenames to prevent conflicts

## Deployment

The application is ready for deployment to grassrootskw.org with no code changes needed - just ensure environment variables are properly configured in your hosting platform.
