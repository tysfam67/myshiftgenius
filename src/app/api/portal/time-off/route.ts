import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { PortalSession, TimeOffType } from '@/types'

export async function POST(request: Request) {
  const cookieStore = await cookies()

  const sessionCookie = cookieStore.get('portal_session')
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let session: PortalSession
  try {
    session = JSON.parse(sessionCookie.value) as PortalSession
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  if (new Date(session.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 })
  }

  let body: { type: TimeOffType; date: string; start_time?: string; end_time?: string; reason?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { type, date, start_time, end_time, reason } = body

  if (!type || !date) {
    return NextResponse.json({ error: 'type and date are required' }, { status: 400 })
  }

  if (type === 'partial' && (!start_time || !end_time)) {
    return NextResponse.json({ error: 'start_time and end_time are required for partial requests' }, { status: 400 })
  }

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

  const { data, error } = await supabase
    .from('time_off_requests')
    .insert({
      employee_id: session.employee_id,
      client_id: session.client_id,
      location_id: session.location_id,
      type,
      date,
      ...(type === 'partial' && { start_time, end_time }),
      ...(reason && { reason }),
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id })
}
