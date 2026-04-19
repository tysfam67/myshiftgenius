import { createClient } from '@/lib/supabase-server'
import { foundersStillAvailable } from '@/lib/constants'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
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

    if (!mssUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Count active locations for quantity billing
    const { data: locations } = await supabase
      .from('gb_locations')
      .select('id')
      .eq('client_id', mssUser.client_id)
      .eq('active', true)

    const locationCount = Math.max(locations?.length ?? 1, 1)

    // Get or create Stripe customer
    const { data: clientRow } = await supabase
      .from('gb_clients')
      .select('stripe_customer_id, contact_email, name')
      .eq('client_id', mssUser.client_id)
      .single()

    let customerId = clientRow?.stripe_customer_id

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: clientRow?.contact_email ?? user.email,
        name: clientRow?.name ?? undefined,
        metadata: { client_id: mssUser.client_id },
      })
      customerId = customer.id
      await supabase
        .from('gb_clients')
        .update({ stripe_customer_id: customerId })
        .eq('client_id', mssUser.client_id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://myshiftgenius.com'

    // Founders Plan ($39/loc) is offered to anyone who subscribes through Oct 31, 2026.
    // After that, new signups go straight to Standard ($49/loc).
    // For founders subscribers, the webhook installs a subscription schedule that
    // auto-upgrades to Standard at midnight UTC on Nov 1, 2026.
    const isFounders = foundersStillAvailable()
    const priceId = isFounders
      ? process.env.STRIPE_PRICE_ID_FOUNDERS!
      : process.env.STRIPE_PRICE_ID_STANDARD!

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: locationCount }],
      subscription_data: {
        trial_period_days: 30,
        metadata: {
          client_id: mssUser.client_id,
          plan: isFounders ? 'founders' : 'standard',
          location_count: String(locationCount),
        },
      },
      success_url: `${appUrl}/dashboard?billing=success`,
      cancel_url:  `${appUrl}/dashboard?billing=cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
