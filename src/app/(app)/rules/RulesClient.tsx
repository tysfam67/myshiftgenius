'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Info, X, Plus, CheckCircle2 } from 'lucide-react'
import { MANAGEMENT_TIERS } from '@/lib/constants'

type RulesJson = {
  store_hours?: { open?: string; close?: string }
  labor_rules?: Record<string, number>
  scheduling_preferences?: Record<string, number | boolean>
  minor_rules?: Record<string, number | string | boolean>
  availability?: Record<string, number | boolean>
  required_operational_roles?: string[]
}

type Category = { category_id: string; label: string; roles: string[] }

function SectionCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {hint && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Info className="h-3.5 w-3.5" /> {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function NumericField({ id, label, defaultVal, min, max, suffix }: {
  id: string; label: string; defaultVal: number; min?: number; max?: number; suffix?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id} name={id} type="number"
          defaultValue={defaultVal} min={min ?? 0} max={max}
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {suffix && <span className="text-sm text-slate-400 whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  )
}

function Toggle({ id, label, description, defaultChecked }: {
  id: string; label: string; description?: string; defaultChecked?: boolean
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-6 shrink-0">
        <input type="checkbox" name={id} id={id} className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  )
}

export default function RulesClient({
  initialRules,
  initialRoles,
  businessCategory,
  categories,
}: {
  initialRules: RulesJson
  initialRoles: string[]
  businessCategory: string | null
  categories: Category[]
}) {
  const router = useRouter()
  const [roles, setRoles] = useState<string[]>(initialRoles)
  const [newRole, setNewRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [, startTransition] = useTransition()

  const sh = initialRules.store_hours ?? {}
  const lr = initialRules.labor_rules ?? {}
  const sp = initialRules.scheduling_preferences ?? {}
  const mr = initialRules.minor_rules ?? {}
  const av = initialRules.availability ?? {}
  const requiredOps = new Set(initialRules.required_operational_roles ?? [])

  const category = categories.find(c => c.category_id === businessCategory)

  function addRole() {
    const trimmed = newRole.trim()
    if (!trimmed) return
    if (roles.some(r => r.toLowerCase() === trimmed.toLowerCase())) {
      setNewRole('')
      return
    }
    if (trimmed.length > 40) {
      setError('Role name must be 40 characters or fewer')
      return
    }
    setRoles([...roles, trimmed])
    setNewRole('')
  }

  function removeRole(r: string) {
    setRoles(roles.filter(x => x !== r))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    setSaved(false)
    const form = new FormData(e.currentTarget)
    const num = (k: string) => {
      const v = form.get(k)
      return v === null || v === '' ? undefined : Number(v)
    }
    const bool = (k: string) => form.get(k) === 'on'
    const str = (k: string) => {
      const v = form.get(k)
      return typeof v === 'string' && v.length > 0 ? v : undefined
    }

    const requiredOpRoles = roles.filter(r => form.get(`require_role_${r}`) === 'on')

    const payload = {
      store_hours: {
        open: str('store_open'),
        close: str('store_close'),
      },
      labor_rules: {
        min_hours_per_week: num('min_hours_per_week'),
        max_hours_per_week: num('max_hours_per_week'),
        min_shifts_per_week: num('min_shifts_per_week'),
        max_shifts_per_week: num('max_shifts_per_week'),
        min_days_off_per_week: num('min_days_off_per_week'),
        max_consecutive_days: num('max_consecutive_days'),
        min_hours_between_shifts: num('clopening_min_gap_hours'),
      },
      scheduling_preferences: {
        schedule_horizon_weeks: num('schedule_horizon_weeks'),
        prefer_consistent_shifts: bool('prefer_consistent_shifts'),
        prefer_no_clopening: bool('prefer_no_clopening'),
        prefer_fulltime_first: bool('prefer_fulltime_first'),
        prefer_seniority: bool('prefer_seniority'),
      },
      minor_rules: {
        max_hours_per_week: num('minor_max_hours_per_week'),
        max_hours_per_day: num('minor_max_hours_per_day'),
        latest_shift_end: str('minor_latest_shift_end'),
        no_weekend_opens: bool('minor_no_weekend_opens'),
        school_days_only_short: bool('minor_school_days_only_short'),
      },
      availability: {
        auto_approve: bool('auto_approve_availability'),
        require_time_off_approval: bool('require_time_off_approval'),
        lead_days: num('time_off_request_lead_days'),
      },
      required_operational_roles: requiredOpRoles,
      operational_roles: roles,
    }

    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save rules')
        setSaving(false)
        return
      }
      setSaving(false)
      setSaved(true)
      startTransition(() => router.refresh())
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Scheduling Rules</h1>
        <p className="text-slate-500 mt-1">All constraints the AI enforces when building schedules for your team</p>
        {category && (
          <p className="text-xs text-slate-400 mt-2">Business type: <span className="font-medium text-slate-600">{category.label}</span></p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <SectionCard title="Store Hours" hint="Used to bound all shift times">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <div>
              <label htmlFor="store_open" className="block text-sm font-medium text-slate-700 mb-1.5">Opening time</label>
              <input id="store_open" name="store_open" type="time" defaultValue={sh.open ?? '07:00'}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="store_close" className="block text-sm font-medium text-slate-700 mb-1.5">Closing time</label>
              <input id="store_close" name="store_close" type="time" defaultValue={sh.close ?? '22:00'}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <NumericField id="schedule_horizon_weeks" label="Schedule horizon" defaultVal={Number(sp.schedule_horizon_weeks) || 2} min={1} max={8} suffix="weeks" />
          </div>
        </SectionCard>

        <SectionCard title="Hours & Shifts Per Employee" hint="Applied to every employee unless overridden">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            <NumericField id="min_hours_per_week" label="Min hours / week" defaultVal={Number(lr.min_hours_per_week) || 20} />
            <NumericField id="max_hours_per_week" label="Max hours / week" defaultVal={Number(lr.max_hours_per_week) || 40} />
            <NumericField id="min_shifts_per_week" label="Min shifts / week" defaultVal={Number(lr.min_shifts_per_week) || 4} />
            <NumericField id="max_shifts_per_week" label="Max shifts / week" defaultVal={Number(lr.max_shifts_per_week) || 5} />
            <NumericField id="min_days_off_per_week" label="Min days off / week" defaultVal={Number(lr.min_days_off_per_week) || 2} />
            <NumericField id="max_consecutive_days" label="Max consecutive days" defaultVal={Number(lr.max_consecutive_days) || 5} />
          </div>
        </SectionCard>

        <SectionCard
          title="Operational Roles"
          hint="Roles your team members perform on a shift"
        >
          <p className="text-sm text-slate-500 mb-4">
            Add or remove roles specific to your business. Check the box next to any role that must be covered on every shift.
          </p>
          {roles.length === 0 ? (
            <p className="text-sm text-slate-400 italic mb-4">No roles yet — add your first one below.</p>
          ) : (
            <div className="space-y-2 mb-5">
              {roles.map(r => (
                <div key={r} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      name={`require_role_${r}`}
                      defaultChecked={requiredOps.has(r)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{r}</span>
                    <span className="text-xs text-slate-400 ml-2">(check to require on every shift)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeRole(r)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-red-500"
                    aria-label={`Remove ${r}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRole() } }}
              placeholder="Add a role (e.g., Cashier, Barista, Stylist)"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            />
            <button
              type="button"
              onClick={addRole}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Minor Worker Rules" hint="Applied to any employee marked as a minor">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 mb-5">
            <NumericField id="minor_max_hours_per_week" label="Max hours / week" defaultVal={Number(mr.max_hours_per_week) || 20} />
            <NumericField id="minor_max_hours_per_day" label="Max hours / day" defaultVal={Number(mr.max_hours_per_day) || 6} />
            <div>
              <label htmlFor="minor_latest_shift_end" className="block text-sm font-medium text-slate-700 mb-1.5">
                Latest allowed shift end
              </label>
              <input id="minor_latest_shift_end" name="minor_latest_shift_end" type="time" defaultValue={typeof mr.latest_shift_end === 'string' ? mr.latest_shift_end : '20:00'}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
          </div>
          <Toggle
            id="minor_no_weekend_opens"
            label="No weekend opening shifts for minors"
            description="Minors won't be scheduled for early weekend shifts"
            defaultChecked={Boolean(mr.no_weekend_opens)}
          />
          <Toggle
            id="minor_school_days_only_short"
            label="School days: max 4-hour shifts"
            description="Mon–Fri shifts capped at 4 hours when school is in session"
            defaultChecked={Boolean(mr.school_days_only_short)}
          />
        </SectionCard>

        <SectionCard title="Scheduling Preferences" hint="Soft rules the AI tries to honor when possible">
          <Toggle
            id="prefer_consistent_shifts"
            label="Prefer consistent shift times"
            description="Try to give employees the same shift each day rather than mixing morning and closing"
            defaultChecked={sp.prefer_consistent_shifts !== false}
          />
          <Toggle
            id="prefer_no_clopening"
            label="No clopenings"
            description="Don't schedule an employee to close and then open the next morning"
            defaultChecked={sp.prefer_no_clopening !== false}
          />
          <div className="mt-4">
            <NumericField
              id="clopening_min_gap_hours"
              label="Minimum hours between close and next open shift"
              defaultVal={Number(lr.min_hours_between_shifts) || 10}
              min={0}
              max={24}
              suffix="hours"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <Toggle
              id="prefer_fulltime_first"
              label="Fill full-time employees to their minimum first"
              description="Prioritize hitting guaranteed hours for full-time staff before assigning part-time"
              defaultChecked={sp.prefer_fulltime_first !== false}
            />
            <Toggle
              id="prefer_seniority"
              label="Prefer senior employees for desirable shifts"
              description={'GMs and AMs get first pick of morning and mid shifts'}
              defaultChecked={Boolean(sp.prefer_seniority)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Availability & Time-Off Settings" hint="Controls how employee requests flow into the schedule">
          <Toggle
            id="auto_approve_availability"
            label="Auto-approve recurring availability"
            description="Standing unavailability from the employee portal is applied automatically without manager review"
            defaultChecked={av.auto_approve !== false}
          />
          <Toggle
            id="require_time_off_approval"
            label="Require manager approval for time-off requests"
            description="Time-off requests go to pending until a manager approves or denies them"
            defaultChecked={av.require_time_off_approval !== false}
          />
          <div className="mt-4">
            <NumericField
              id="time_off_request_lead_days"
              label="Minimum days in advance for time-off requests"
              defaultVal={Number(av.lead_days) || 7}
              min={0}
              suffix="days"
            />
          </div>
        </SectionCard>

        {/* Management tiers — informational only for now. Tier changes not yet editable. */}
        <SectionCard title="Management Tiers" hint="Hierarchy used by the scheduler">
          <p className="text-sm text-slate-500 mb-3">
            These tiers are applied to every employee you add. Editing the hierarchy will be available in a future update.
          </p>
          <div className="flex flex-wrap gap-2">
            {MANAGEMENT_TIERS.map(t => (
              <span key={t.value} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {t.value} — {t.label}
              </span>
            ))}
          </div>
        </SectionCard>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {saved && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Rules saved.
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">Rules apply to all locations unless overridden per location</p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save rules'}
          </button>
        </div>
      </form>
    </div>
  )
}
