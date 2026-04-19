import { Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { GenerateButton } from './GenerateButton'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-amber-50 text-amber-700',
  pending_review: 'bg-blue-50 text-blue-700',
  approved: 'bg-green-50 text-green-700',
  published: 'bg-indigo-50 text-indigo-700',
  generated: 'bg-purple-50 text-purple-700',
}

interface GbShift {
  id: string
  employee_id: string
  date: string
  shift_key: string
  start_time: string
  end_time: string
  hours: number
}

interface GbEmployee {
  id: string
  name: string
}

export default async function SchedulePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: mssUser } = await supabase
    .from('mss_users')
    .select('client_id')
    .eq('id', user.id)
    .single()

  const clientId = mssUser?.client_id ?? null

  // Latest schedule
  const { data: schedule } = clientId
    ? await supabase
        .from('gb_schedules')
        .select('id, week_start, status')
        .eq('client_id', clientId)
        .order('week_start', { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null }

  // If a schedule exists, fetch shifts and employees
  let shifts: GbShift[] = []
  let employees: GbEmployee[] = []

  if (schedule) {
    const [shiftsResult, empsResult] = await Promise.all([
      supabase
        .from('gb_schedule_shifts')
        .select('id, employee_id, date, shift_key, start_time, end_time, hours')
        .eq('schedule_id', schedule.id),
      clientId
        ? supabase
            .from('gb_employees')
            .select('id, name')
            .eq('client_id', clientId)
            .eq('active', true)
        : Promise.resolve({ data: [] }),
    ])
    shifts = (shiftsResult.data as GbShift[]) ?? []
    employees = (empsResult.data as GbEmployee[]) ?? []
  }

  // Build week days from week_start
  const weekDates: string[] = []
  if (schedule?.week_start) {
    const base = new Date(schedule.week_start)
    for (let i = 0; i < 7; i++) {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      weekDates.push(d.toISOString().slice(0, 10))
    }
  }

  // Map shifts by employee_id + date
  const shiftMap = new Map<string, GbShift>()
  for (const s of shifts) {
    shiftMap.set(`${s.employee_id}:${s.date}`, s)
  }

  const hasSchedule = !!schedule
  const hasShifts = shifts.length > 0

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
          <p className="text-slate-500 mt-1">Generate and manage weekly schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
            <option>All locations</option>
          </select>
          <GenerateButton variant="secondary" label="Regenerate" weekStart={schedule?.week_start} />
          <GenerateButton variant="primary" label="New Schedule" />
        </div>
      </div>

      {hasSchedule && (
        <div className="mb-5 flex items-center gap-3 bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-3">
          <button className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-500">&#8249;</button>
          <span className="text-sm font-medium text-slate-700">Week of {schedule.week_start}</span>
          <button className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-500">&#8250;</button>
          <span className={`ml-auto text-xs px-2 py-1 rounded-md font-medium ${STATUS_COLORS[schedule.status] ?? 'bg-slate-100 text-slate-600'}`}>
            {schedule.status.replace('_', ' ')}
          </span>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 ml-2">
            Publish &amp; share
          </button>
        </div>
      )}

      {!hasSchedule ? (
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <Calendar className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No schedule generated yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6">
              Make sure you have at least one location and some employees before generating.
            </p>
            <GenerateButton variant="primary" label="Generate schedule" />
          </div>
        </div>
      ) : hasShifts ? (
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 font-medium text-slate-500 min-w-[140px]">Employee</th>
                {DAYS.map((day, i) => (
                  <th key={day} className="text-center px-3 py-3 font-medium text-slate-500 min-w-[100px]">
                    <span>{day}</span>
                    {weekDates[i] && (
                      <span className="block text-xs text-slate-400 font-normal">{weekDates[i].slice(5)}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-900">{emp.name}</td>
                  {weekDates.map(date => {
                    const shift = shiftMap.get(`${emp.id}:${date}`)
                    return (
                      <td key={date} className="px-3 py-3 text-center">
                        {shift ? (
                          <div className="inline-flex flex-col items-center gap-0.5">
                            <span className="text-xs font-medium text-indigo-700 bg-indigo-50 rounded px-2 py-0.5">
                              {shift.shift_key}
                            </span>
                            <span className="text-xs text-slate-400">
                              {shift.start_time}–{shift.end_time}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-200">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="h-10 w-10 mb-3 text-slate-200" />
            <p className="text-sm text-slate-400">Schedule exists but has no shifts yet</p>
          </div>
        </div>
      )}
    </div>
  )
}
