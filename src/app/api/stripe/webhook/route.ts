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

      if (clientId) {
        await supabase
          .from('gb_clients')
          .update({ billing_tier: 'trial' })
          .eq('client_id', clientId)
      }

      // Schedule the $49 upgrade at month 12 for Founders Plan subscribers
      if (isFounders && session.subscription) {
        const locationCount = parseInt(
          (session.metadata as Record<string, string>)?.location_count ?? '1'
        )
        await scheduleFoundersPriceUpgrade(session.subscription as string, locationCount)
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const clientId = sub.metadata?.client_id
      if (clientId) {
        const tier = sub.status === 'trialing' ? 'trial'
          : sub.status === 'active' ? 'active'
          : sub.status === 'canceled' ? 'cancelled'
          : 'trial'
        await supabase
          .from('gb_clients')
          .update({ billing_tier: tier })
          .eq('client_id', clientId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const clientId = sub.metadata?.client_id
      if (clientId) {
        await supabase
          .from('gb_clients')
          .update({ billing_tier: 'cancelled' })
          .eq('client_id', clientId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
