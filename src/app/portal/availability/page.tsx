'use client'

import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

type DayState = {
  unavailable_all_day: boolean
  unavailable_before: string
  unavailable_after: string
  note: string
}

const defaultDay = (): DayState => ({
  unavailable_all_day: false,
  unavailable_before: '',
  unavailable_after: '',
  note: '',
})

export default function PortalAvailabilityPage() {
  const [availability, setAvailability] = useState<Record<string, DayState>>(
    Object.fromEntries(DAYS.map(d => [d, defaultDay()]))
  )
  const [saved, setSaved] = useState(false)

  function update(day: string, field: keyof DayState, value: string | boolean) {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
    setSaved(false)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // TODO: POST /api/portal/availability
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">My Weekly Availability</h2>
        <p className="text-sm text-slate-500 mt-1">
          Tell us when you&apos;re generally not available. This repeats every week and is applied
          automatically to your schedule unless you submit a specific time-off request.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        {DAYS.map(day => {
          const avail = availability[day]
          return (
            <div key={day} className="rounded-xl bg-white border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-slate-900 w-10">{day}</span>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-red-500 focus:ring-red-400"
                    checked={avail.unavailable_all_day}
                    onChange={e => update(day, 'unavailable_all_day', e.target.checked)}
                  />
                  Not available all day
                </label>
              </div>

              {!avail.unavailable_all_day && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      Not available <strong>before</strong>
                    </label>
                    <input
                      type="time"
                      value={avail.unavailable_before}
                      onChange={e => update(day, 'unavailable_before', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. 10:00"
                    />
                    <p className="text-xs text-slate-400 mt-1">Leave blank if no restriction</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      Not available <strong>after</strong>
                    </label>
                    <input
                      type="time"
                      value={avail.unavailable_after}
                      onChange={e => update(day, 'unavailable_after', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. 18:00"
                    />
                    <p className="text-xs text-slate-400 mt-1">Leave blank if no restriction</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Note (optional)</label>
                    <input
                      type="text"
                      value={avail.note}
                      onChange={e => update(day, 'note', e.target.value)}
                      placeholder="e.g. School pickup at 3pm"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">
            Changes take effect on the next schedule generation.
          </p>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {saved ? '✓ Saved' : 'Save availability'}
          </button>
        </div>
      </form>
    </div>
  )
}
