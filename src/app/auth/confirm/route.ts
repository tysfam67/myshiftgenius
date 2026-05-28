import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Handles all Supabase email-link confirmations: signup, recovery, magiclink,
// invite, email_change, reauthentication. The link in the email (assembled
// by /api/auth/email-hook) points here with:
//   /auth/confirm?token_hash=...&type=<email_action_type>&next=<redirect_to>
//
// On success the user's session cookies are written and we redirect to `next`
// (or /dashboard). On failure we bounce to /auth/login with an error param.

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_confirmation_params`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash })

  if (error) {
    console.error('[auth/confirm] verifyOtp failed:', error.message)
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.message)}`
    )
  }

  const safeNext = next.startsWith('/') ? next : '/dashboard'
  return NextResponse.redirect(`${origin}${safeNext}`)
}
