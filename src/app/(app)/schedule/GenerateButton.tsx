'use client'

import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'

interface GenerateButtonProps {
  variant: 'primary' | 'secondary'
  weekStart?: string
  label: string
}

export function GenerateButton({ variant, weekStart, label }: GenerateButtonProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/schedule/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weekStart ? { week_start: weekStart } : {}),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setMessage(data.message)
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {variant === 'secondary' ? (
        <button
          onClick={handleClick}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Queuing…' : label}
        </button>
      ) : (
        <button
          onClick={handleClick}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {loading ? 'Queuing…' : label}
        </button>
      )}
      {message && (
        <p className="text-xs text-slate-500 max-w-xs text-right">{message}</p>
      )}
    </div>
  )
}
