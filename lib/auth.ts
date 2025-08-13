import GoogleProvider from "next-auth/providers/google"
import { config } from "./config"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { Account } from "next-auth"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
  // Use dynamic URL configuration
  ...(config.isProduction() && { 
    url: config.getBaseUrl() 
  }),
}
