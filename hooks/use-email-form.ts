"use client"

import { useState, useEffect } from "react"

export interface UseEmailFormOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
  validateOnChange?: boolean
}

export interface UseEmailFormReturn {
  email: string
  setEmail: (email: string) => void
  isValidEmail: boolean
  clientError: string
  setClientError: (error: string) => void
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  validateEmail: (email: string) => boolean
  resetForm: () => void
}

/**
 * Custom hook for managing email form state and validation
 */
export function useEmailForm(options: UseEmailFormOptions = {}): UseEmailFormReturn {
  const { onSuccess, onError, validateOnChange = true } = options
  
  const [email, setEmail] = useState("")
  const [clientError, setClientError] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(false)

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  // Handle email input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    
    // Clear previous client errors
    setClientError("")
    
    // Validate email format
    const isValid = validateEmail(newEmail)
    setIsValidEmail(isValid)
    
    // Show validation feedback if enabled
    if (validateOnChange && newEmail.length > 0 && !isValid) {
      setClientError("Please enter a valid email address")
    }
  }

  // Reset form to initial state
  const resetForm = () => {
    setEmail("")
    setIsValidEmail(false)
    setClientError("")
  }

  // Call callbacks when state changes
  useEffect(() => {
    if (clientError && onError) {
      onError(clientError)
    }
  }, [clientError, onError])

  return {
    email,
    setEmail,
    isValidEmail,
    clientError,
    setClientError,
    handleEmailChange,
    validateEmail,
    resetForm,
  }
}