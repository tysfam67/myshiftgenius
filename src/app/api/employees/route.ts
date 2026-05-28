import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function clientPrefix(clientId: string): string {
  const parts = clientId.split('_').filter(Boolean)
  if (parts.length >= 2) {
    return parts.map(p => p[0]).join('').toLowerCase().slice(0, 3)
  }
  return clientId.slice(0, 2).toLowerCase()
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: mssUser } = await supabase
    .from('mss_users')
    .select('client_id')
    .eq('id', user.id)
    .single()

  if (!mssUser?.client_id) {
    return NextResponse.json({ error: 'No client associated with this account' }, { status: 400 })
  }

  let body: {
    name?: string
    email?: string
    phone?: string
    management_tier?: string
    location_id?: string
    type?: string
    minor?: boolean
    hourly_rate?: string | number
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const name = body.name?.trim()
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const allowedTiers = ['TM', 'SL', 'AM', 'GM']
  const managementTier = allowedTiers.includes(body.management_tier ?? '')
    ? body.management_tier!
    : 'TM'

  const allowedTypes = ['parttime', 'fulltime']
  const type = allowedTypes.includes(body.type ?? '') ? body.type! : 'parttime'

  const email = body.email?.trim().toLowerCase() || null
  const phone = body.phone?.trim() || null
  const locationId = body.location_id?.trim() || null
  const minor = Boolean(body.minor)
  const hourlyRateRaw = body.hourly_rate
  const hourlyRate =
    hourlyRateRaw === '' || hourlyRateRaw === undefined || hourlyRateRaw === null
      ? null
      : Number(hourlyRateRaw)
  if (hourlyRate !== null && !Number.isFinite(hourlyRate)) {
    return NextResponse.json({ error: 'hourly_rate must be a number' }, { status: 400 })
  }

  // If a location_id was provided, make sure it belongs to this client.
  if (locationId) {
    const { data: loc } = await supabase
      .from('gb_locations')
      .select('id')
      .eq('id', locationId)
      .eq('client_id', mssUser.client_id)
      .maybeSingle()
    if (!loc) {
      return NextResponse.json({ error: 'Invalid location_id' }, { status: 400 })
    }
  }

  // Generate id as {prefix}_emp_{nnn} using current employee count for this client.
  const { count } = await supabase
    .from('gb_employees')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', mssUser.client_id)

  const nextNumber = (count ?? 0) + 1
  const prefix = clientPrefix(mssUser.client_id)
  const id = `${prefix}_emp_${String(nextNumber).padStart(3, '0')}`

  const { data: inserted, error } = await supabase
    .from('gb_employees')
    .insert({
      id,
      client_id: mssUser.client_id,
      name,
      email,
      phone,
      management_tier: managementTier,
      roles: [managementTier],
      location_id: locationId,
      type,
      minor,
      hourly_rate: hourlyRate,
      active: true,
    })
    .select('id, name, management_tier, location_id, days_off, active')
    .single()

  if (error) {
    console.error('[api/employees] insert failed:', { clientId: mssUser.client_id, error })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ employee: inserted }, { status: 201 })
}
