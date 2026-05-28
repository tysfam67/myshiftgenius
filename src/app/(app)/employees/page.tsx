import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import EmployeesClient from './EmployeesClient'

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: mssUser, error: mssUserErr } = await supabase
    .from('mss_users')
    .select('client_id')
    .eq('id', user.id)
    .single()
  if (mssUserErr) console.error('[employees] mss_users lookup failed:', mssUserErr)

  const clientId = mssUser?.client_id ?? null

  const [employeesResult, locationsResult] = await Promise.all([
    clientId
      ? supabase
          .from('gb_employees')
          .select('id, name, management_tier, location_id, days_off, active')
          .eq('client_id', clientId)
          .order('name')
      : Promise.resolve({ data: [], error: null }),
    clientId
      ? supabase
          .from('gb_locations')
          .select('id, address, city, state')
          .eq('client_id', clientId)
          .eq('active', true)
          .order('city')
      : Promise.resolve({ data: [], error: null }),
  ])

  if (employeesResult.error) console.error('[employees] gb_employees lookup failed:', employeesResult.error)
  if (locationsResult.error) console.error('[employees] gb_locations lookup failed:', locationsResult.error)

  const employees = employeesResult.data ?? []
  const locations = (locationsResult.data ?? []).map(l => ({
    id: l.id,
    label: `${l.city}, ${l.state} — ${l.address}`,
  }))

  return <EmployeesClient initialEmployees={employees} locations={locations} />
}
