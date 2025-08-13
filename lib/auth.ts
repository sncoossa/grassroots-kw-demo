import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { config } from "./config"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user && token) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
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
