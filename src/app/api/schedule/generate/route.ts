import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get client_id for this user
  const { data: mssUser } = await supabase
    .from('mss_users')
    .select('client_id')
    .eq('id', user.id)
    .single()

  if (!mssUser?.client_id) {
    return NextResponse.json({ error: 'No client associated with this account' }, { status: 400 })
  }

  // Parse week_start from body, default to next Monday
  let weekStart: string
  try {
    const body = await request.json()
    weekStart = body.week_start
  } catch {
    weekStart = ''
  }

  if (!weekStart) {
    // Default to next Monday
    const today = new Date()
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7
    const nextMonday = new Date(today)
    nextMonday.setDate(today.getDate() + daysUntilMonday)
    weekStart = nextMonday.toISOString().slice(0, 10)
  }

  // Check for existing pending/running request for this client + week
  const { data: existing } = await supabase
    .from('gb_schedule_requests')
    .select('id, status')
    .eq('client_id', mssUser.client_id)
    .eq('week_start', weekStart)
    .in('status', ['pending', 'running'])
    .maybeSingle()

  if (existing) {
    return NextResponse.json({
      queued: false,
      message: `A schedule request for ${weekStart} is already ${existing.status}`,
      requestId: existing.id,
    })
  }

  // Insert the request
  const { data: req, error } = await supabase
    .from('gb_schedule_requests')
    .insert({
      client_id: mssUser.client_id,
      week_start: weekStart,
      requested_by: user.email,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    queued: true,
    requestId: req.id,
    weekStart,
    message: `Schedule generation queued for week of ${weekStart}. Check back in a few minutes.`,
  })
}
