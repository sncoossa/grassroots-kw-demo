/**
 * Production-safe logging utility
 * Only logs in development environment to avoid console output in production
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  error: (...args: unknown[]) => {
    // Always log errors, even in production, but they can be filtered by log management
    console.error(...args)
  }
}
