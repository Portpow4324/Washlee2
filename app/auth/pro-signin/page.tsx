'use client'

import Image from 'next/image'
import Button from '@/components/Button'
import Spinner from '@/components/Spinner'
import Link from 'next/link'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function ProSignin() {
  const [employeeId, setEmployeeId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Check if employee ID exists in Firestore
      const proDoc = await getDoc(doc(db, 'washlee_pros', employeeId))
      
      if (!proDoc.exists()) {
        setError('Employee ID not found. Please check your credentials.')
        setIsLoading(false)
        return
      }

      const proData = proDoc.data()

      // Verify email matches
      if (proData.email !== email) {
        setError('Email does not match the Employee ID. Please try again.')
        setIsLoading(false)
        return
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      setSuccessMessage(`✅ Welcome back, ${proData.firstName}! Logging you in...`)

      // Redirect to pro dashboard
      setTimeout(() => {
        router.push('/dashboard/pro')
      }, 1500)
    } catch (err: any) {
      console.error('Pro signin error:', err)
      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password. Please try again.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.')
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.')
      } else {
        setError(err.message || 'Failed to sign in')
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint to-white flex items-center justify-center px-4">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 p-2 hover:bg-white rounded-full transition"
        title="Go back"
      >
        <ArrowLeft size={24} className="text-primary" />
      </button>

      <Link href="/" className="absolute top-6 right-6 px-4 py-2 bg-white text-primary rounded-full font-semibold hover:shadow-lg transition">
        Home
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Image
              src="/logo-washlee.png"
              alt="Washlee Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="font-bold text-2xl text-dark">Washlee Pro</span>
          </Link>
          <h1 className="text-3xl font-bold text-dark">Pro Sign In</h1>
          <p className="text-gray mt-2">Access your Washlee Pro account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Employee ID Field */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Employee ID*</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your Employee ID (Payslip Number)"
                className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
              <p className="text-xs text-gray mt-1">Your Employee ID is typically found on your payslip</p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email*</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Password*</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray hover:text-primary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              size="lg"
              disabled={isLoading || !employeeId || !email || !password}
            >
              {isLoading ? <Spinner /> : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray/20"></div>
            <span className="text-sm text-gray">or</span>
            <div className="flex-1 h-px bg-gray/20"></div>
          </div>

          {/* Create Account Link */}
          <div className="text-center">
            <p className="text-sm text-gray">
              Not a Washlee Pro yet?{' '}
              <Link 
                href="/auth/pro-signup" 
                className="text-primary font-semibold hover:underline"
              >
                Apply here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
