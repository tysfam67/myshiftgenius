import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Rules API
//   GET  /api/rules  — return { rules, operational_roles, business_category, categories }
//   POST /api/rules  — merge incoming UI payload into gb_rules.rules_json +
//                       update gb_clients.operational_roles if provided.
//
// The UI stores a simplified view; the scheduler (George) reads a richer
// canonical structure. This API is the translation layer between the two.

function getSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
}

type RulesPayload = {
  store_hours?: { open?: string; close?: string }
  labor_rules?: {
    min_hours_per_week?: number
    max_hours_per_week?: number
    min_shifts_per_week?: number
    max_shifts_per_week?: number
    min_days_off_per_week?: number
    max_consecutive_days?: number
    min_hours_between_shifts?: number
  }
  scheduling_preferences?: {
    schedule_horizon_weeks?: number
    prefer_consistent_shifts?: boolean
    prefer_no_clopening?: boolean
    prefer_fulltime_first?: boolean
    prefer_seniority?: boolean
  }
  minor_rules?: {
    max_hours_per_week?: number
    max_hours_per_day?: number
    latest_shift_end?: string
    no_weekend_opens?: boolean
    school_days_only_short?: boolean
  }
  availability?: {
    auto_approve?: boolean
    require_time_off_approval?: boolean
    lead_days?: number
  }
  required_operational_roles?: string[]
  operational_roles?: string[]
}

export async function GET() {
  const cookieStore = await cookies()
  const supabase = getSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: mssUser } = await supabase
    .from('mss_users').select('client_id').eq('id', user.id).single()
  if (!mssUser?.client_id) {
    return NextResponse.json({ error: 'No client associated' }, { status: 400 })
  }

  const [rulesRes, clientRes, templatesRes] = await Promise.all([
    supabase.from('gb_rules').select('rules_json').eq('client_id', mssUser.client_id).eq('is_active', true).maybeSingle(),
    supabase.from('gb_clients').select('business_category, operational_roles').eq('client_id', mssUser.client_id).single(),
    supabase.from('gb_role_templates').select('category_id, label, roles').order('sort_order'),
  ])

  return NextResponse.json({
    rules: rulesRes.data?.rules_json ?? {},
    business_category: clientRes.data?.business_category ?? null,
    operational_roles: clientRes.data?.operational_roles ?? [],
    categories: templatesRes.data ?? [],
  })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = getSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: mssUser } = await supabase
    .from('mss_users').select('client_id').eq('id', user.id).single()
  if (!mssUser?.client_id) {
    return NextResponse.json({ error: 'No client associated' }, { status: 400 })
  }

  let body: RulesPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Merge into existing rules_json (preserve fields the UI doesn't own,
  // like positions, staffing_by_time_block, notes, etc).
  const { data: existing } = await supabase
    .from('gb_rules')
    .select('id, rules_json')
    .eq('client_id', mssUser.client_id)
    .eq('is_active', true)
    .maybeSingle()

  const current = (existing?.rules_json ?? {}) as Record<string, unknown>
  const nextRules: Record<string, unknown> = { ...current }

  if (body.store_hours) nextRules.store_hours = { ...(current.store_hours as object ?? {}), ...body.store_hours }
  if (body.labor_rules) nextRules.labor_rules = { ...(current.labor_rules as object ?? {}), ...body.labor_rules }
  if (body.scheduling_preferences) {
    nextRules.scheduling_preferences = { ...(current.scheduling_preferences as object ?? {}), ...body.scheduling_preferences }
  }
  if (body.minor_rules) nextRules.minor_rules = { ...(current.minor_rules as object ?? {}), ...body.minor_rules }
  if (body.availability) nextRules.availability = { ...(current.availability as object ?? {}), ...body.availability }
  if (body.required_operational_roles) nextRules.required_operational_roles = body.required_operational_roles
  nextRules.updated_at = new Date().toISOString()

  if (existing?.id) {
    const { error } = await supabase
      .from('gb_rules')
      .update({ rules_json: nextRules, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) {
      console.error('[api/rules] gb_rules update failed:', { clientId: mssUser.client_id, error })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    const { error } = await supabase
      .from('gb_rules')
      .insert({ client_id: mssUser.client_id, label: 'Default', rules_json: nextRules, is_active: true })
    if (error) {
      console.error('[api/rules] gb_rules insert failed:', { clientId: mssUser.client_id, error })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  // Update operational_roles on gb_clients if provided.
  if (body.operational_roles !== undefined) {
    const cleaned = Array.from(new Set(
      body.operational_roles.map(r => r.trim()).filter(r => r.length > 0 && r.length <= 40)
    ))
    const { error } = await supabase
      .from('gb_clients')
      .update({ operational_roles: cleaned })
      .eq('client_id', mssUser.client_id)
    if (error) {
      console.error('[api/rules] gb_clients operational_roles update failed:', { clientId: mssUser.client_id, error })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, rules: nextRules })
}
