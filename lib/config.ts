/**
 * Environment Configuration Utility
 * Automatically detects and configures URLs based on the deployment environment
 */

export const config = {
  // Get the appropriate base URL for the current environment
  getBaseUrl(): string {
    // 1. Check for explicit environment variable
    if (process.env.NEXTAUTH_URL) {
      return process.env.NEXTAUTH_URL
    }

    // 2. Production environment
    if (process.env.NODE_ENV === 'production') {
      // Check for common deployment platform variables
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
      }
      if (process.env.NETLIFY_URL) {
        return process.env.NETLIFY_URL
      }
      // Default production URL
      return 'https://grassrootskw.org'
    }

    // 3. Development environment
    const port = process.env.PORT || '3000'
    return `http://localhost:${port}`
  },

  // Get Google OAuth callback URL
  getGoogleCallbackUrl(): string {
    return `${this.getBaseUrl()}/api/auth/callback/google`
  },

  // Check if we're in production
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  },

  // Check if we're running locally
  isLocal(): boolean {
    return !this.isProduction() || this.getBaseUrl().includes('localhost')
  },

  // Get environment info for debugging
  getEnvironmentInfo() {
    return {
      NODE_ENV: process.env.NODE_ENV,
      baseUrl: this.getBaseUrl(),
      callbackUrl: this.getGoogleCallbackUrl(),
      isProduction: this.isProduction(),
      isLocal: this.isLocal(),
      // Platform detection
      platform: process.env.VERCEL_URL ? 'Vercel' 
               : process.env.NETLIFY_URL ? 'Netlify'
               : process.env.AWS_REGION ? 'AWS'
               : 'Local/Other'
    }
  }
}
