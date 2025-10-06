'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-custom-bg">
          <div className="max-w-md p-8 text-center">
            <h2 className="text-2xl font-bold text-custom-green mb-4">
              Something went wrong
            </h2>
            <p className="text-custom-green/80 mb-6">
              We're experiencing some technical difficulties. Please try refreshing the page or contact support at info@grassrootskw.org.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-custom-green text-custom-bg px-4 py-2 rounded hover:bg-custom-green/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary