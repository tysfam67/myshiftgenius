'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, X } from 'lucide-react'

type Location = {
  id: string
  address: string
  city: string
  state: string
  manager_name: string | null
  active: boolean
}

export default function LocationsClient({ initialLocations }: { initialLocations: Location[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const locations = initialLocations
  const hasLocations = locations.length > 0

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const form = new FormData(e.currentTarget)
    const payload = {
      address: String(form.get('address') || ''),
      city: String(form.get('city') || ''),
      state: String(form.get('state') || ''),
      zip: String(form.get('zip') || ''),
      phone: String(form.get('phone') || ''),
      manager_name: String(form.get('manager_name') || ''),
      manager_email: String(form.get('manager_email') || ''),
    }

    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save location')
        setSaving(false)
        return
      }
      setOpen(false)
      setSaving(false)
      startTransition(() => router.refresh())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Locations</h1>
          <p className="text-slate-500 mt-1">Manage your locations</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Location
        </button>
      </div>

      {hasLocations ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <div key={loc.id} className="rounded-xl bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  loc.active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {loc.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 mt-2">{loc.address}</p>
              <p className="text-sm text-slate-500">{loc.city}, {loc.state}</p>
              {loc.manager_name && (
                <p className="text-xs text-slate-400 mt-2">Manager: {loc.manager_name}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <MapPin className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No locations yet</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Add your first location to start building schedules for your team.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add your first location
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Add Location</h2>
              <button
                onClick={() => { setOpen(false); setError(null) }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Street address <span className="text-red-500">*</span>
                </label>
                <input
                  id="address" name="address" type="text" required autoFocus
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-6 gap-3">
                <div className="col-span-3">
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city" name="city" type="text" required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-1">
                  <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="state" name="state" type="text" required maxLength={2}
                    placeholder="AZ"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 uppercase focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="zip" className="block text-sm font-medium text-slate-700 mb-1.5">Zip</label>
                  <input
                    id="zip" name="zip" type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input
                  id="phone" name="phone" type="tel"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="manager_name" className="block text-sm font-medium text-slate-700 mb-1.5">Manager name</label>
                  <input
                    id="manager_name" name="manager_name" type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="manager_email" className="block text-sm font-medium text-slate-700 mb-1.5">Manager email</label>
                  <input
                    id="manager_email" name="manager_email" type="email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setOpen(false); setError(null) }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
