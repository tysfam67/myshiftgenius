import { Info } from 'lucide-react'
import { MANAGEMENT_TIERS, OPERATIONAL_ROLES } from '@/lib/constants'

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

export default function RulesPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Scheduling Rules</h1>
        <p className="text-slate-500 mt-1">All constraints the AI enforces when building schedules for your team</p>
      </div>

      <form className="space-y-6" action="/api/rules" method="POST">

        {/* ── 1. Store Hours ──────────────────────────── */}
        <SectionCard title="Store Hours" hint="Used to bound all shift times">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <div>
              <label htmlFor="store_open" className="block text-sm font-medium text-slate-700 mb-1.5">Opening time</label>
              <input id="store_open" name="store_open" type="time" defaultValue="07:00"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="store_close" className="block text-sm font-medium text-slate-700 mb-1.5">Closing time</label>
              <input id="store_close" name="store_close" type="time" defaultValue="22:00"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <NumericField id="schedule_horizon_weeks" label="Schedule horizon" defaultVal={2} min={1} max={8} suffix="weeks" />
          </div>
        </SectionCard>

        {/* ── 2. Hours & Shifts ───────────────────────── */}
        <SectionCard title="Hours & Shifts Per Employee" hint="Applied to every employee unless overridden">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            <NumericField id="min_hours_per_week" label="Min hours / week" defaultVal={20} />
            <NumericField id="max_hours_per_week" label="Max hours / week" defaultVal={40} />
            <NumericField id="min_shifts_per_week" label="Min shifts / week" defaultVal={4} />
            <NumericField id="max_shifts_per_week" label="Max shifts / week" defaultVal={5} />
            <NumericField id="min_days_off_per_week" label="Min days off / week" defaultVal={2} />
            <NumericField id="max_consecutive_days" label="Max consecutive days" defaultVal={5} />
          </div>
        </SectionCard>

        {/* ── 3. Shift Templates ──────────────────────── */}
        <SectionCard title="Shift Templates" hint="Define the named shifts employees are assigned to">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="pb-3 font-medium text-slate-500 pr-4">Label</th>
                  <th className="pb-3 font-medium text-slate-500 pr-4">Start</th>
                  <th className="pb-3 font-medium text-slate-500 pr-4">End</th>
                  <th className="pb-3 font-medium text-slate-500 pr-4">Hours</th>
                  <th className="pb-3 font-medium text-slate-500 pr-4">Min role required</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { label: 'Opening', start: '07:00', end: '15:00', hours: 8, min_role: 'SL' },
                  { label: 'Morning', start: '08:00', end: '16:00', hours: 8, min_role: 'TM' },
                  { label: 'Mid', start: '10:00', end: '18:00', hours: 8, min_role: 'TM' },
                  { label: 'Afternoon', start: '13:00', end: '21:00', hours: 8, min_role: 'TM' },
                  { label: 'Close', start: '14:00', end: '22:00', hours: 8, min_role: 'SL' },
                ].map((shift, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-4">
                      <input type="text" defaultValue={shift.label} className="rounded border border-slate-200 px-2 py-1.5 w-28 text-sm focus:border-indigo-500 focus:outline-none" />
                    </td>
                    <td className="py-3 pr-4">
                      <input type="time" defaultValue={shift.start} className="rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" />
                    </td>
                    <td className="py-3 pr-4">
                      <input type="time" defaultValue={shift.end} className="rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" />
                    </td>
                    <td className="py-3 pr-4">
                      <input type="number" defaultValue={shift.hours} className="rounded border border-slate-200 px-2 py-1.5 w-16 text-sm focus:border-indigo-500 focus:outline-none" />
                    </td>
                    <td className="py-3 pr-4">
                      <select defaultValue={shift.min_role} className="rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
                        {MANAGEMENT_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </td>
                    <td className="py-3">
                      <button type="button" className="text-xs text-slate-400 hover:text-red-500">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
            + Add shift
          </button>
        </SectionCard>

        {/* ── 4. Coverage Requirements ────────────────── */}
        <SectionCard
          title="Coverage Requirements"
          hint="Minimum staff per shift — enforced before any individual rules"
        >
          <p className="text-sm text-slate-500 mb-4">
            Set how many people must be on per shift, and which roles must be present.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="pb-3 font-medium text-slate-500 pr-4">Shift</th>
                  <th className="pb-3 font-medium text-slate-500 pr-4">Applies to</th>
                  <th className="pb-3 font-medium text-slate-500 pr-4">Min staff</th>
                  <th className="pb-3 font-medium text-slate-500 pr-4">Must include role</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { shift: 'Opening', day_type: 'all', min_staff: 3, required_role: 'SL' },
                  { shift: 'Morning', day_type: 'weekday', min_staff: 4, required_role: 'TM' },
                  { shift: 'Morning', day_type: 'weekend', min_staff: 5, required_role: 'SL' },
                  { shift: 'Mid', day_type: 'all', min_staff: 4, required_role: 'TM' },
                  { shift: 'Afternoon', day_type: 'all', min_staff: 4, required_role: 'TM' },
                  { shift: 'Close', day_type: 'all', min_staff: 3, required_role: 'SL' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-4">
                      <select defaultValue={row.shift} className="rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
                        {['Opening', 'Morning', 'Mid', 'Afternoon', 'Close'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <select defaultValue={row.day_type} className="rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
                        <option value="all">All days</option>
                        <option value="weekday">Weekdays only</option>
                        <option value="weekend">Weekends only</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <input type="number" defaultValue={row.min_staff} min={1}
                        className="rounded border border-slate-200 px-2 py-1.5 w-16 text-sm focus:border-indigo-500 focus:outline-none" />
                    </td>
                    <td className="py-3 pr-4">
                      <select defaultValue={row.required_role} className="rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
                        <option value="">Any</option>
                        {MANAGEMENT_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </td>
                    <td className="py-3">
                      <button type="button" className="text-xs text-slate-400 hover:text-red-500">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
            + Add coverage rule
          </button>
        </SectionCard>

        {/* ── 5. Role Coverage ────────────────────────── */}
        <SectionCard
          title="Operational Role Requirements"
          hint="Ensure specific job skills are present on every shift"
        >
          <p className="text-sm text-slate-500 mb-4">
            Select which operational roles must have at least one person scheduled per shift.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {OPERATIONAL_ROLES.map(role => (
              <label key={role} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" name={`require_role_${role}`}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  defaultChecked={['Cashier', 'Cook'].includes(role)}
                />
                {role}
              </label>
            ))}
          </div>
        </SectionCard>

        {/* ── 6. Minor Worker Rules ───────────────────── */}
        <SectionCard
          title="Minor Worker Rules"
          hint="Applied to any employee marked as a minor"
        >
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 mb-5">
            <NumericField id="minor_max_hours_per_week" label="Max hours / week" defaultVal={20} />
            <NumericField id="minor_max_hours_per_day" label="Max hours / day" defaultVal={6} />
            <div>
              <label htmlFor="minor_latest_shift_end" className="block text-sm font-medium text-slate-700 mb-1.5">
                Latest allowed shift end
              </label>
              <input id="minor_latest_shift_end" name="minor_latest_shift_end" type="time" defaultValue="20:00"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
          </div>
          <Toggle
            id="minor_no_weekend_opens"
            label="No weekend opening shifts for minors"
            description="Minors won't be scheduled for early weekend shifts"
          />
          <Toggle
            id="minor_school_days_only_short"
            label="School days: max 4-hour shifts"
            description="Mon–Fri shifts capped at 4 hours when school is in session"
          />
        </SectionCard>

        {/* ── 7. Scheduling Preferences ──────────────── */}
        <SectionCard
          title="Scheduling Preferences"
          hint="Soft rules the AI tries to honor when possible"
        >
          <Toggle
            id="prefer_consistent_shifts"
            label="Prefer consistent shift times"
            description="Try to give employees the same shift each day rather than mixing morning and closing"
            defaultChecked
          />
          <Toggle
            id="prefer_no_clopening"
            label="No clopenings"
            description="Don't schedule an employee to close and then open the next morning"
            defaultChecked
          />
          <div className="mt-4">
            <NumericField
              id="clopening_min_gap_hours"
              label="Minimum hours between close and next open shift"
              defaultVal={10}
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
              defaultChecked
            />
            <Toggle
              id="prefer_seniority"
              label="Prefer senior employees for desirable shifts"
              description="GMs and AMs get first pick of morning and mid shifts"
            />
          </div>
        </SectionCard>

        {/* ── 8. Availability & Time-Off ──────────────── */}
        <SectionCard
          title="Availability & Time-Off Settings"
          hint="Controls how employee requests flow into the schedule"
        >
          <Toggle
            id="auto_approve_availability"
            label="Auto-approve recurring availability"
            description="Standing unavailability from the employee portal is applied automatically without manager review"
            defaultChecked
          />
          <Toggle
            id="require_time_off_approval"
            label="Require manager approval for time-off requests"
            description="Time-off requests go to pending until a manager approves or denies them"
            defaultChecked
          />
          <div className="mt-4">
            <NumericField
              id="time_off_request_lead_days"
              label="Minimum days in advance for time-off requests"
              defaultVal={7}
              min={0}
              suffix="days"
            />
          </div>
        </SectionCard>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">Rules apply to all locations unless overridden per location</p>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Save rules
          </button>
        </div>
      </form>
    </div>
  )
}
