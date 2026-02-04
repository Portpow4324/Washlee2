'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Link from 'next/link'
import { Mail, Lock, Briefcase, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function EmployeeSignIn() {
  const router = useRouter()
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    // Validate input
    if (!employeeId.trim() || !password.trim()) {
      setError('Please enter both employee ID and password')
      return
    }

    if (!/^\d{6}$/.test(employeeId.trim())) {
      setError('Employee ID must be a 6-digit number')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/employee-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employeeId.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      setSuccessMessage(`Welcome, ${data.employee.firstName}!`)

      // Store token and redirect
      localStorage.setItem('employeeToken', data.token)
      localStorage.setItem('employeeData', JSON.stringify(data.employee))

      // Redirect to employee dashboard
      setTimeout(() => {
        router.push('/dashboard/employee')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#48C9B0] transition mb-6">
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-[#48C9B0] to-[#3aad9a] p-3 rounded-lg">
              <Briefcase size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1f2d2b]">Employee Portal</h1>
              <p className="text-gray-600 text-sm">Sign in to your dashboard</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee ID Field */}
            <div>
              <label htmlFor="employeeId" className="block text-sm font-bold text-[#1f2d2b] mb-2 uppercase tracking-widest">
                Employee ID
              </label>
              <div className="relative">
                <Briefcase size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="employeeId"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={employeeId}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '')
                    setEmployeeId(value)
                  }}
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48C9B0] focus:border-transparent transition font-mono text-lg tracking-widest"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Format: 6 digits (e.g., 234567)</p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-[#1f2d2b] mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 py-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48C9B0] focus:border-transparent transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-3 items-start">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg flex gap-3 items-start">
                <span className="text-2xl">✓</span>
                <p className="font-semibold">{successMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !employeeId || !password}
              className="w-full py-3 text-lg font-bold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
            </div>
          </div>

          {/* Signup Link */}
          <Link href="/auth/pro-signup">
            <Button variant="outline" className="w-full py-3 text-lg font-bold">
              Become an Employee
            </Button>
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-[#1f2d2b] mb-2">💡 Need Help?</h3>
          <p className="text-sm text-gray-700 mb-3">
            Your 6-digit employee ID was provided when you completed your application.
          </p>
          <p className="text-xs text-gray-600">
            Check your email for your employee credentials. If you don't have them, contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
