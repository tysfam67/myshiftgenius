import Link from 'next/link'
import {
  APP_NAME,
  PRICE_PER_LOCATION,
  FOUNDERS_PRICE_PER_LOCATION,
  TRIAL_DAYS,
  foundersStillAvailable,
} from '@/lib/constants'
import { CheckCircle, Sparkles } from 'lucide-react'

const features = [
  'Unlimited employees per location',
  'AI-powered schedule generation',
  'Custom shift templates & rules',
  'Multi-location management',
  'Publish & share schedules via link',
  'Hours summary & employee view',
  'Email notifications',
  'Availability submission forms',
  'CSV employee import',
  'Priority support',
]

export default function PricingPage() {
  const foundersOpen = foundersStillAvailable()
  const displayPrice = foundersOpen ? FOUNDERS_PRICE_PER_LOCATION : PRICE_PER_LOCATION

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">{APP_NAME}</Link>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm text-slate-600 hover:text-slate-900">Sign in</Link>
            <Link href="/auth/signup" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        {foundersOpen && (
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
            <Sparkles className="h-4 w-4" />
            Founders pricing — lock in $39/location through October 31, 2026
          </div>
        )}
        <h1 className="text-4xl font-bold text-slate-900">Simple pricing that scales with you</h1>
        <p className="mt-4 text-xl text-slate-500">
          Pay only for the locations you run. No per-user fees, no annual contracts.
        </p>

        <div className="mt-16 mx-auto max-w-md">
          <div className="rounded-2xl border-2 border-indigo-600 bg-white p-8 shadow-lg">
            <div className="text-sm font-semibold uppercase tracking-wide text-indigo-600 mb-2">
              {foundersOpen ? 'Founders Plan' : 'Per Location'}
            </div>
            <div className="flex items-end justify-center gap-2 mb-1">
              {foundersOpen && (
                <span className="text-3xl font-bold text-slate-400 line-through self-end mb-2">${PRICE_PER_LOCATION}</span>
              )}
              <span className="text-6xl font-bold text-slate-900">${displayPrice}</span>
              <span className="text-slate-500 mb-2">/mo</span>
            </div>
            <p className="text-slate-500 text-sm mb-2">
              per location, billed monthly
            </p>
            {foundersOpen && (
              <p className="text-xs text-indigo-700 font-medium mb-8">
                Locked at $39 through Oct 31, 2026 · ${PRICE_PER_LOCATION}/mo thereafter
              </p>
            )}
            {!foundersOpen && <div className="mb-8" />}

            <div className="space-y-3 text-left mb-8">
              {features.map(f => (
                <div key={f} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                  {f}
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup"
              className="block w-full rounded-xl bg-indigo-600 py-3.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Start {TRIAL_DAYS}-day free trial
            </Link>
            <p className="mt-3 text-xs text-slate-400 text-center">No credit card required</p>
          </div>
        </div>

        <div className="mt-12 text-sm text-slate-500">
          <strong>Example:</strong> 9 locations = ${displayPrice * 9}/month total.
          Serving 180 employees across 9 locations costs less than one hour of labor.
        </div>
      </div>
    </div>
  )
}
