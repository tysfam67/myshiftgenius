'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Plus, Upload, X } from 'lucide-react'
import { MANAGEMENT_TIERS } from '@/lib/constants'

type Employee = {
  id: string
  name: string
  management_tier: string
  location_id: string | null
  days_off: string[] | null
  active: boolean
}

type LocationOption = {
  id: string
  label: string
}

export default function EmployeesClient({
  initialEmployees,
  locations,
}: {
  initialEmployees: Employee[]
  locations: LocationOption[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const employees = initialEmployees
  const hasEmployees = employees.length > 0

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      management_tier: String(form.get('management_tier') || 'TM'),
      location_id: String(form.get('location_id') || ''),
      type: String(form.get('type') || 'parttime'),
      minor: form.get('minor') === 'on',
      hourly_rate: String(form.get('hourly_rate') || ''),
    }

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save employee')
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
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 mt-1">Manage your team across all locations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled
            title="CSV import coming soon"
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {hasEmployees ? (
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 font-medium text-slate-500">Name</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Tier</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Location</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Days Off</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-900">{emp.name}</td>
                  <td className="px-5 py-3 text-slate-600">{emp.management_tier}</td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-xs">{emp.location_id ?? '—'}</td>
                  <td className="px-5 py-3 text-slate-500">{emp.days_off?.join(', ') || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      emp.active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {emp.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No employees yet</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Add your team members one at a time to start building schedules.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add your first employee
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Add Employee</h2>
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
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name" name="name" type="text" required autoFocus
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    id="email" name="email" type="email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <input
                    id="phone" name="phone" type="tel"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="management_tier" className="block text-sm font-medium text-slate-700 mb-1.5">Management tier</label>
                  <select
                    id="management_tier" name="management_tier" defaultValue="TM"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {MANAGEMENT_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1.5">Employment type</label>
                  <select
                    id="type" name="type" defaultValue="parttime"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="parttime">Part-time</option>
                    <option value="fulltime">Full-time</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="location_id" className="block text-sm font-medium text-slate-700 mb-1.5">Primary location</label>
                <select
                  id="location_id" name="location_id" defaultValue=""
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">— Unassigned —</option>
                  {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="hourly_rate" className="block text-sm font-medium text-slate-700 mb-1.5">Hourly rate</label>
                  <input
                    id="hourly_rate" name="hourly_rate" type="number" step="0.01" min="0"
                    placeholder="15.00"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-end pb-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" id="minor" name="minor"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    Under 18 (minor)
                  </label>
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
                  {saving ? 'Saving…' : 'Save employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
