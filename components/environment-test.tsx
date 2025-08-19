"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

/**
 * Environment Test Component
 * Tests API functionality across localhost and production environments
 */
export function EnvironmentTest() {
  const { data: session } = useSession()
  const [isTestingAPI, setIsTestingAPI] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const runAPITests = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to run API tests")
      return
    }

    setIsTestingAPI(true)
    setTestResults([])
    const results: string[] = []

    try {
      // Test 1: Profile API GET
      results.push("Testing Profile API GET...")
      const getResponse = await fetch('/api/profile')
      if (getResponse.ok) {
        results.push("✅ Profile GET: Success")
      } else {
        results.push(`❌ Profile GET: Failed (${getResponse.status})`)
      }

      // Test 2: Profile API POST (safe test data)
      results.push("Testing Profile API POST...")
      const testData = {
        bio: `API test - ${new Date().toISOString()}`
      }
      
      const postResponse = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      })
      
      if (postResponse.ok) {
        results.push("✅ Profile POST: Success")
      } else {
        const errorData = await postResponse.json()
        results.push(`❌ Profile POST: Failed - ${errorData.error}`)
      }

      // Test 3: Environment detection
      results.push("Testing Environment Detection...")
      const currentDomain = window.location.origin
      if (currentDomain.includes('localhost')) {
        results.push("✅ Environment: Development (localhost)")
      } else if (currentDomain.includes('grassrootskw.org')) {
        results.push("✅ Environment: Production (grassrootskw.org)")
      } else {
        results.push(`✅ Environment: Other (${currentDomain})`)
      }

      setTestResults([...results])
      toast.success("API tests completed!")

    } catch (error) {
      results.push(`❌ Test Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setTestResults([...results])
      toast.error("API tests failed")
    } finally {
      setIsTestingAPI(false)
    }
  }

  if (!session) {
    return (
      <div className="p-4 border border-yellow-500 rounded-lg bg-yellow-50">
        <p className="text-yellow-800">Please sign in to test API functionality</p>
      </div>
    )
  }

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">🔧 Environment & API Tests</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Current Environment: <strong>{origin || "Unknown"}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            User: <strong>{session.user.email}</strong>
          </p>
        </div>

        <Button 
          onClick={runAPITests}
          disabled={isTestingAPI}
          className="w-full"
        >
          {isTestingAPI ? "Running Tests..." : "Run API Tests"}
        </Button>

        {testResults.length > 0 && (
          <div className="mt-4 p-3 bg-white border rounded">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="text-sm space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
