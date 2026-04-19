'use client'

import Link from 'next/link'
import { useState } from 'react'
import { APP_NAME, PRICE_PER_LOCATION, TRIAL_DAYS } from '@/lib/constants'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [brand, setBrand] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, brand },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">{APP_NAME}</Link>
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="rounded-full bg-green-50 w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-indigo-600">{APP_NAME}</Link>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Start your free trial</h1>
          <p className="mt-1 text-slate-500">{TRIAL_DAYS} days free, then ${PRICE_PER_LOCATION}/location/month</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Smith"
                />
              </div>
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-slate-700 mb-1.5">Franchise brand</label>
              <input
                id="brand"
                name="brand"
                type="text"
                required
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Jersey Mike's"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Work email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Min 8 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : `Create account — free for ${TRIAL_DAYS} days`}
            </button>
            <p className="text-center text-xs text-slate-400">No credit card required</p>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
