'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react'

type RequestType = 'full_day' | 'partial'

type TimeOffRequest = {
  id: number
  type: RequestType
  date: string
  start_time?: string
  end_time?: string
  reason?: string
  status: 'pending' | 'approved' | 'denied'
  submitted: string
}

// Placeholder — will come from Supabase
const existingRequests: TimeOffRequest[] = [
  { id: 1, type: 'full_day', date: '2026-03-25', reason: 'Family event', status: 'pending', submitted: 'Mar 10' },
  { id: 2, type: 'full_day', date: '2026-03-10', reason: 'Doctor appointment', status: 'approved', submitted: 'Mar 5' },
  { id: 3, type: 'partial', date: '2026-03-07', start_time: '08:00', end_time: '12:00', reason: 'Morning appointment', status: 'denied', submitted: 'Mar 3' },
]

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', className: 'text-amber-600 bg-amber-50' },
  approved: { icon: CheckCircle, label: 'Approved', className: 'text-green-600 bg-green-50' },
  denied: { icon: XCircle, label: 'Denied', className: 'text-red-600 bg-red-50' },
}

export default function TimeOffPage() {
  const [requestType, setRequestType] = useState<RequestType>('full_day')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)

    const body: Record<string, string> = {
      type: requestType,
      date: data.get('date') as string,
    }
    if (requestType === 'partial') {
      body.start_time = data.get('start_time') as string
      body.end_time = data.get('end_time') as string
    }
    const reason = data.get('reason') as string
    if (reason) body.reason = reason

    const res = await fetch('/api/portal/time-off', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
    } else {
      const json = await res.json()
      setError(json.error ?? 'Failed to submit request')
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Time Off Requests</h2>
        <p className="text-sm text-slate-500 mt-1">
          Submit a request for a full day off or a partial day. Your manager will review and approve or deny.
        </p>
      </div>

      {/* New request form */}
      <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-5">New Request</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Request type</label>
            <div className="flex gap-3">
              {(['full_day', 'partial'] as RequestType[]).map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="request_type"
                    value={t}
                    checked={requestType === t}
                    onChange={() => setRequestType(t)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">
                    {t === 'full_day' ? 'Full day off' : 'Part of a shift'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Partial time range */}
          {requestType === 'partial' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Unavailable from
                </label>
                <input
                  id="start_time"
                  name="start_time"
                  type="time"
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Unavailable until
                </label>
                <input
                  id="end_time"
                  name="end_time"
                  type="time"
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1.5">
              Reason <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={3}
              placeholder="e.g. Doctor appointment, family event..."
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {submitted && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Request submitted — your manager will review it shortly.
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Submit request
          </button>
        </form>
      </div>

      {/* Request history */}
      <div className="rounded-xl bg-white border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Request History</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {existingRequests.map(req => {
            const { icon: Icon, label, className } = statusConfig[req.status]
            return (
              <div key={req.id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">
                      {req.type === 'full_day' ? 'Full Day' : 'Partial Day'} — {req.date}
                    </p>
                  </div>
                  {req.type === 'partial' && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {req.start_time} – {req.end_time}
                    </p>
                  )}
                  {req.reason && (
                    <p className="text-xs text-slate-400 mt-1 italic">{req.reason}</p>
                  )}
                  <p className="text-xs text-slate-300 mt-1">Submitted {req.submitted}</p>
                </div>
                <span className={`flex items-center gap-1.5 shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
