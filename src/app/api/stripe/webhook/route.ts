import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { FOUNDERS_CUTOFF_MS } from '@/lib/constants'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

function getAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

// Founders Plan ($39/loc) auto-upgrades to Standard ($49/loc) at midnight UTC
// on Nov 1, 2026. Single fixed cutoff for all founders subscribers, regardless
// of when they signed up.
const FOUNDERS_CUTOFF_UNIX = Math.floor(FOUNDERS_CUTOFF_MS / 1000)

async function scheduleFoundersPriceUpgrade(subscriptionId: string, locationCount: number) {
  if (Date.now() >= FOUNDERS_CUTOFF_MS) {
    // Already past the cutoff — nothing to schedule, this subscriber should
    // already be on the Standard price (set in checkout).
    return
  }
  try {
    const schedule = await getStripe().subscriptionSchedules.create({
      from_subscription: subscriptionId,
    })
    const currentPhase = schedule.phases[0]

    await getStripe().subscriptionSchedules.update(schedule.id, {
      phases: [
        {
          // Phase 1: Founders Plan ($39/loc) until Nov 1 2026 00:00 UTC
          items: [{ price: process.env.STRIPE_PRICE_ID_FOUNDERS!, quantity: locationCount }],
          start_date: currentPhase.start_date,
          end_date: FOUNDERS_CUTOFF_UNIX,
          trial_end: currentPhase.trial_end ?? undefined,
          metadata: { plan: 'founders' },
        },
        {
          // Phase 2: Standard Plan ($49/loc) from Nov 1 2026 onward, forever.
          items: [{ price: process.env.STRIPE_PRICE_ID_STANDARD!, quantity: locationCount }],
          metadata: { plan: 'standard' },
        },
      ],
      end_behavior: 'release',
    })

    console.log(`Founders upgrade scheduled for ${subscriptionId} (cutoff ${new Date(FOUNDERS_CUTOFF_MS).toISOString()})`)
  } catch (err) {
    console.error('Failed to schedule founders upgrade:', err)
  }
}

type AdminClient = ReturnType<typeof getAdminClient>
type BillingTier = 'trial' | 'active' | 'cancelled'

// Update the billing tier for a client. If the gb_clients row doesn't exist
// (e.g. pre-trigger user, or the on_auth_user_created trigger failed silently),
// recover by pulling brand + business_category from auth.users.user_metadata
// and INSERTing a complete row. Without this, a paying customer can end up
// with billing_tier=null and be locked behind the subscribe banner.
async function applyBillingTier(
  supabase: AdminClient,
  clientId: string,
  tier: BillingTier,
  stripeIds: { customerId?: string | null; subscriptionId?: string | null } = {}
) {
  const patch: Record<string, unknown> = { billing_tier: tier }
  if (stripeIds.customerId !== undefined) patch.stripe_customer_id = stripeIds.customerId
  if (stripeIds.subscriptionId !== undefined) patch.stripe_subscription_id = stripeIds.subscriptionId

  const { data, error } = await supabase
    .from('gb_clients')
    .update(patch)
    .eq('client_id', clientId)
    .select('client_id')

  if (error) {
    console.error('[stripe-webhook] gb_clients update failed', { clientId, tier, error })
    return
  }
  if (data && data.length > 0) return

  // No row updated — fall through to recovery INSERT.
  console.warn('[stripe-webhook] gb_clients row missing — recovering from auth metadata', { clientId, tier })

  const { data: mssUser, error: mssErr } = await supabase
    .from('mss_users')
    .select('id')
    .eq('client_id', clientId)
    .maybeSingle()
  if (mssErr || !mssUser) {
    console.error('[stripe-webhook] no mss_users row for client_id, cannot recover', { clientId, error: mssErr })
    return
  }

  const { data: authData, error: authErr } = await supabase.auth.admin.getUserById(mssUser.id)
  if (authErr || !authData?.user) {
    console.error('[stripe-webhook] auth user lookup failed', { uid: mssUser.id, error: authErr })
    return
  }

  const md = (authData.user.user_metadata ?? {}) as Record<string, string>
  const insertRow = {
    client_id: clientId,
    brand: md.brand ?? clientId,
    rules_file: clientId,
    business_category: md.business_category ?? 'other',
    billing_tier: tier,
    contact_email: authData.user.email ?? null,
    notify_email: authData.user.email ?? null,
    stripe_customer_id: stripeIds.customerId ?? null,
    stripe_subscription_id: stripeIds.subscriptionId ?? null,
  }

  const { error: insertErr } = await supabase.from('gb_clients').insert(insertRow)
  if (insertErr) {
    console.error('[stripe-webhook] recovery insert failed', { clientId, error: insertErr })
    return
  }
  console.log('[stripe-webhook] gb_clients recovered for client_id', { clientId, tier })
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const meta = (session.metadata ?? {}) as Record<string, string>
      const clientId = meta.client_id
      const isFounders = meta.plan === 'founders'

      if (!clientId) {
        console.error('[stripe-webhook] checkout.session.completed missing client_id metadata', { sessionId: session.id })
        break
      }

      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null

      await applyBillingTier(supabase, clientId, 'trial', { customerId, subscriptionId })

      // Schedule the $49 upgrade at month 12 for Founders Plan subscribers
      if (isFounders && session.subscription) {
        const locationCount = parseInt(meta.location_count ?? '1')
        await scheduleFoundersPriceUpgrade(session.subscription as string, locationCount)
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const clientId = sub.metadata?.client_id
      if (!clientId) {
        console.warn('[stripe-webhook] customer.subscription.updated missing client_id metadata', { subscriptionId: sub.id })
        break
      }
      const tier: BillingTier = sub.status === 'trialing' ? 'trial'
        : sub.status === 'active' ? 'active'
        : sub.status === 'canceled' ? 'cancelled'
        : 'trial'
      await applyBillingTier(supabase, clientId, tier, {
        customerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
        subscriptionId: sub.id,
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const clientId = sub.metadata?.client_id
      if (!clientId) {
        console.warn('[stripe-webhook] customer.subscription.deleted missing client_id metadata', { subscriptionId: sub.id })
        break
      }
      await applyBillingTier(supabase, clientId, 'cancelled')
      break
    }
  }

  return NextResponse.json({ received: true })
}
