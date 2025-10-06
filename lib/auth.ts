import GoogleProvider from "next-auth/providers/google"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { Account } from "next-auth"

// Validate required environment variables - use console.error instead of throwing to prevent server crashes
const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
}

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key, _]) => key)

if (missingEnvVars.length > 0) {
  console.error(`[AUTH] Missing required environment variables: ${missingEnvVars.join(', ')}`)
  // In production, we'll still try to continue with fallback behavior instead of crashing
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'missing-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'missing-google-client-secret',
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  // Add production-specific configuration
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Use environment variable for URL configuration
  ...(process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL && {
    url: process.env.NEXTAUTH_URL
  }),
}
