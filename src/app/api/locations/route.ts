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
    address?: string
    city?: string
    state?: string
    zip?: string
    phone?: string
    manager_name?: string
    manager_email?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const address = body.address?.trim()
  const city = body.city?.trim()
  const state = body.state?.trim().toUpperCase()
  const zip = body.zip?.trim() || null
  const phone = body.phone?.trim() || null
  const managerName = body.manager_name?.trim() || null
  const managerEmail = body.manager_email?.trim().toLowerCase() || null

  if (!address || !city || !state) {
    return NextResponse.json({ error: 'address, city, and state are required' }, { status: 400 })
  }
  if (state.length !== 2) {
    return NextResponse.json({ error: 'state must be a 2-letter code' }, { status: 400 })
  }

  const { data: maxRow } = await supabase
    .from('gb_locations')
    .select('number')
    .eq('client_id', mssUser.client_id)
    .order('number', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextNumber = (maxRow?.number ?? 0) + 1
  const prefix = clientPrefix(mssUser.client_id)
  const id = `${prefix}_${String(nextNumber).padStart(3, '0')}`

  const { data: inserted, error } = await supabase
    .from('gb_locations')
    .insert({
      id,
      client_id: mssUser.client_id,
      number: nextNumber,
      address,
      city,
      state,
      zip,
      phone,
      manager_name: managerName,
      manager_email: managerEmail,
      active: true,
    })
    .select('id, address, city, state, manager_name, active')
    .single()

  if (error) {
    console.error('[api/locations] insert failed:', { clientId: mssUser.client_id, error })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ location: inserted }, { status: 201 })
}
