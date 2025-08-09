# Grassroots KW - Supabase Setup Instructions

## Environment Variables

You'll need to add the following environment variables to your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Database Setup

1. **Run the SQL setup script**:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `scripts/setup-nextauth-tables.sql`
   - Execute the script to create all necessary tables

2. **Enable Google OAuth**:
   - Go to Google Cloud Console
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Add your callback URL: `http://localhost:3001/api/auth/callback/google`

## Features Implemented

### Authentication
- Google OAuth sign-in via NextAuth.js
- Session management with Supabase adapter
- Protected profile pages
- Automatic user data sync

### User Profiles
- Profile picture upload (base64 for now)
- Name, pronouns, email, phone, bio fields
- Supabase integration for data persistence

### Action Interest Registration
- Form submission with authentication
- Availability grid selection
- Calendar invite generation
- Data persistence in Supabase
- Support for both authenticated and anonymous users

## Database Schema

### Core Tables
- `users` - NextAuth user data
- `accounts` - OAuth account linking
- `sessions` - Active user sessions
- `user_profiles` - Extended profile information
- `action_interests` - User registrations for climate actions

### Security
- Row Level Security (RLS) enabled
- Users can only access their own data
- Service role key required for admin operations

## Next Steps

1. Set up your environment variables
2. Run the SQL setup script in Supabase
3. Configure Google OAuth credentials
4. Test the authentication flow
5. Customize the profile fields as needed

## Testing Authentication

1. Start the development server: `pnpm dev`
2. Navigate to `http://localhost:3001`
3. Click the profile button (top right)
4. Sign in with Google
5. Complete your profile
6. Test indicating interest in an action

## Troubleshooting

- **Authentication not working**: Check your Google OAuth configuration and callback URLs
- **Database errors**: Ensure the SQL script ran successfully and RLS policies are correct
- **Environment variables**: Verify all required variables are set in `.env.local`
