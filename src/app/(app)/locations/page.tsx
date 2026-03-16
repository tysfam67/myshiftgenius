import { MapPin, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function LocationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: mssUser } = await supabase
    .from('mss_users')
    .select('client_id')
    .eq('id', user.id)
    .single()

  const clientId = mssUser?.client_id ?? null

  const { data: locations } = clientId
    ? await supabase
        .from('gb_locations')
        .select('id, address, city, state, manager_name, active')
        .eq('client_id', clientId)
        .order('city')
    : { data: [] }

  const hasLocations = locations && locations.length > 0

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Locations</h1>
          <p className="text-slate-500 mt-1">Manage your franchise locations</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          Add Location
        </button>
      </div>

      {hasLocations ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc: {
            id: string
            address: string
            city: string
            state: string
            manager_name: string | null
            active: boolean
          }) => (
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
            <button className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
              <Plus className="h-4 w-4" />
              Add your first location
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
