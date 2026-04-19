'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'

export function SubscribeButton({
  ctaLabel = 'Start subscription',
  variant = 'primary',
}: {
  ctaLabel?: string
  variant?: 'primary' | 'inline'
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function go() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start checkout')
      window.location.href = data.url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={go}
        disabled={loading}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-60"
      >
        {loading ? 'Loading…' : ctaLabel}
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={go}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        <Sparkles className="h-4 w-4" />
        {loading ? 'Loading…' : ctaLabel}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
