import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import RulesClient from './RulesClient'

export const dynamic = 'force-dynamic'

type RulesJson = {
  store_hours?: { open?: string; close?: string }
  labor_rules?: Record<string, number>
  scheduling_preferences?: Record<string, number | boolean>
  minor_rules?: Record<string, number | string | boolean>
  availability?: Record<string, number | boolean>
  required_operational_roles?: string[]
}

export default async function RulesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: mssUser, error: mssUserErr } = await supabase
    .from('mss_users').select('client_id').eq('id', user.id).single()
  if (mssUserErr) console.error('[rules] mss_users lookup failed:', mssUserErr)
  const clientId = mssUser?.client_id ?? null

  const [rulesRes, clientRes, templatesRes] = await Promise.all([
    clientId
      ? supabase.from('gb_rules').select('rules_json').eq('client_id', clientId).eq('is_active', true).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    clientId
      ? supabase.from('gb_clients').select('business_category, operational_roles').eq('client_id', clientId).single()
      : Promise.resolve({ data: null, error: null }),
    supabase.from('gb_role_templates').select('category_id, label, roles').order('sort_order'),
  ])

  if (rulesRes.error) console.error('[rules] gb_rules lookup failed:', rulesRes.error)
  if (clientRes.error) console.error('[rules] gb_clients lookup failed:', clientRes.error)
  if (templatesRes.error) console.error('[rules] gb_role_templates lookup failed:', templatesRes.error)

  const rules = (rulesRes.data?.rules_json as RulesJson | undefined) ?? {}
  const category = clientRes.data?.business_category ?? null
  const operationalRoles = clientRes.data?.operational_roles ?? []
  const categories = templatesRes.data ?? []

  return (
    <RulesClient
      initialRules={rules}
      initialRoles={operationalRoles}
      businessCategory={category}
      categories={categories}
    />
  )
}
