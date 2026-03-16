import { APP_NAME } from '@/lib/constants'
import { MapPin, Users, Calendar, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get client_id for this user
  const { data: mssUser } = await supabase
    .from('mss_users')
    .select('client_id')
    .eq('id', user.id)
    .single()

  const clientId = mssUser?.client_id ?? null

  // Fetch counts and latest schedule in parallel
  const [locResult, empResult, schedResult] = await Promise.all([
    clientId
      ? supabase.from('gb_locations').select('id', { count: 'exact', head: true }).eq('client_id', clientId)
      : Promise.resolve({ count: 0, error: null }),
    clientId
      ? supabase.from('gb_employees').select('id', { count: 'exact', head: true }).eq('client_id', clientId).eq('active', true)
      : Promise.resolve({ count: 0, error: null }),
    clientId
      ? supabase.from('gb_schedules').select('id, week_start, status').eq('client_id', clientId).order('week_start', { ascending: false }).limit(1).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  const locationCount = locResult.count ?? 0
  const employeeCount = empResult.count ?? 0
  const latestSchedule = (schedResult as { data: { id: string; week_start: string; status: string } | null }).data

  const stats = [
    { label: 'Locations', value: String(locationCount), icon: MapPin, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Employees', value: String(employeeCount), icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Schedules This Week', value: latestSchedule ? '1' : '0', icon: Calendar, color: 'bg-purple-50 text-purple-600' },
    { label: 'Hours Scheduled', value: '—', icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
  ]

  const statusColors: Record<string, string> = {
    draft: 'bg-amber-50 text-amber-700',
    pending_review: 'bg-blue-50 text-blue-700',
    approved: 'bg-green-50 text-green-700',
    published: 'bg-indigo-50 text-indigo-700',
    generated: 'bg-purple-50 text-purple-700',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome to {APP_NAME}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl bg-white border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{label}</span>
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Quick Start</h2>
          <ol className="space-y-3 text-sm text-slate-600">
            {[
              { step: 1, text: 'Add your first location under Locations', href: '/locations' },
              { step: 2, text: 'Import or add your employees under Employees', href: '/employees' },
              { step: 3, text: 'Configure your scheduling rules under Rules', href: '/rules' },
              { step: 4, text: 'Generate your first schedule under Schedule', href: '/schedule' },
            ].map(({ step, text, href }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  {step}
                </span>
                <a href={href} className="hover:text-indigo-600">{text}</a>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Recent Schedules</h2>
          {latestSchedule ? (
            <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900">Week of {latestSchedule.week_start}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${statusColors[latestSchedule.status] ?? 'bg-slate-100 text-slate-600'}`}>
                {latestSchedule.status.replace('_', ' ')}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
              <Calendar className="h-10 w-10 mb-3 text-slate-200" />
              <p className="text-sm">No schedules yet</p>
              <p className="text-xs mt-1">Add a location and generate your first schedule</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
