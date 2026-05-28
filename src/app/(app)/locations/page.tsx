import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import LocationsClient from './LocationsClient'

export default async function LocationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: mssUser, error: mssUserErr } = await supabase
    .from('mss_users')
    .select('client_id')
    .eq('id', user.id)
    .single()
  if (mssUserErr) console.error('[locations] mss_users lookup failed:', mssUserErr)

  const clientId = mssUser?.client_id ?? null

  const { data: locations, error: locationsErr } = clientId
    ? await supabase
        .from('gb_locations')
        .select('id, address, city, state, manager_name, active')
        .eq('client_id', clientId)
        .order('city')
    : { data: [], error: null }
  if (locationsErr) console.error('[locations] gb_locations lookup failed:', locationsErr)

  return <LocationsClient initialLocations={locations ?? []} />
}
