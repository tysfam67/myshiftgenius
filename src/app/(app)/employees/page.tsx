import { Users, Plus, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function EmployeesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: mssUser } = await supabase
    .from('mss_users')
    .select('client_id')
    .eq('id', user.id)
    .single()

  const clientId = mssUser?.client_id ?? null

  const { data: employees } = clientId
    ? await supabase
        .from('gb_employees')
        .select('id, name, management_tier, location_id, days_off, set_shift_hours, active')
        .eq('client_id', clientId)
        .order('name')
    : { data: [] }

  const hasEmployees = employees && employees.length > 0

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 mt-1">Manage your team across all locations</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex items-center gap-3">
        <input
          type="search"
          placeholder="Search employees..."
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
        />
        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
          <option value="">All locations</option>
        </select>
        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
          <option value="">All tiers</option>
          <option value="GM">General Manager</option>
          <option value="AM">Assistant Manager</option>
          <option value="SL">Shift Lead</option>
          <option value="TM">Team Member</option>
        </select>
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
                <th className="text-left px-5 py-3 font-medium text-slate-500">Hrs/wk</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp: {
                id: string
                name: string
                management_tier: string
                location_id: string
                days_off: string[] | null
                set_shift_hours: number | null
                active: boolean
              }) => (
                <tr key={emp.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-900">{emp.name}</td>
                  <td className="px-5 py-3 text-slate-600">{emp.management_tier}</td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-xs">{emp.location_id}</td>
                  <td className="px-5 py-3 text-slate-500">{emp.days_off?.join(', ') || '—'}</td>
                  <td className="px-5 py-3 text-slate-500">{emp.set_shift_hours ?? '—'}</td>
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
              Add employees manually or import a CSV with name, email, role, and location.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Upload className="h-4 w-4" />
                Import CSV
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                <Plus className="h-4 w-4" />
                Add employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
