import { NextResponse } from 'next/server'
import { Webhook } from 'standardwebhooks'

// Supabase Auth → Send Email Hook
// Docs: https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
// Supabase signs the webhook using Standard Webhooks. We verify, then send
// the email through AgentMail's API from gbradshaw@ai.myshiftgenius.com.

const AGENTMAIL_INBOX = 'gbradshaw@ai.myshiftgenius.com'
const AGENTMAIL_SEND_URL = `https://api.agentmail.to/v0/inboxes/${AGENTMAIL_INBOX}/messages/send`

type Payload = {
  user: { id: string; email: string }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type: string
    site_url: string
  }
}

function buildEmail(p: Payload) {
  const { email_action_type, token_hash, redirect_to, site_url, token } = p.email_data
  const next = redirect_to || `${site_url}/dashboard`
  const confirmUrl = `${site_url}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&next=${encodeURIComponent(next)}`
  const sig = '— George Bradshaw\nMyShiftGenius'
  const sigHtml = '<p style="color:#64748b;font-size:13px">— George Bradshaw<br/>MyShiftGenius</p>'

  switch (email_action_type) {
    case 'signup':
      return {
        subject: 'Confirm your MyShiftGenius account',
        text: `Welcome to MyShiftGenius!\n\nClick the link below to confirm your email and activate your account:\n\n${confirmUrl}\n\nIf you didn't create this account, you can safely ignore this message.\n\n${sig}`,
        html: `<p>Welcome to <strong>MyShiftGenius</strong>!</p><p>Click the link below to confirm your email and activate your account:</p><p><a href="${confirmUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Confirm email</a></p><p style="color:#64748b;font-size:13px">Or paste this URL into your browser:<br/><span style="word-break:break-all">${confirmUrl}</span></p>${sigHtml}`,
      }
    case 'recovery':
      return {
        subject: 'Reset your MyShiftGenius password',
        text: `Reset your MyShiftGenius password:\n\n${confirmUrl}\n\nIf you didn't request this, you can ignore this email.\n\n${sig}`,
        html: `<p>Click the link below to reset your MyShiftGenius password:</p><p><a href="${confirmUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Reset password</a></p><p style="color:#64748b;font-size:13px">If you didn't request this, you can ignore this email.</p>${sigHtml}`,
      }
    case 'magiclink':
    case 'login':
      return {
        subject: 'Your MyShiftGenius sign-in link',
        text: `Click to sign in to MyShiftGenius:\n\n${confirmUrl}\n\n${sig}`,
        html: `<p>Click the link below to sign in to MyShiftGenius:</p><p><a href="${confirmUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Sign in</a></p>${sigHtml}`,
      }
    case 'invite':
      return {
        subject: 'You have been invited to MyShiftGenius',
        text: `You've been invited to join MyShiftGenius.\n\nAccept your invitation:\n\n${confirmUrl}\n\n${sig}`,
        html: `<p>You've been invited to join <strong>MyShiftGenius</strong>.</p><p><a href="${confirmUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Accept invite</a></p>${sigHtml}`,
      }
    case 'email_change':
    case 'email_change_new':
      return {
        subject: 'Confirm your new email — MyShiftGenius',
        text: `Click to confirm your new email address for MyShiftGenius:\n\n${confirmUrl}\n\n${sig}`,
        html: `<p>Click the link below to confirm your new email address for MyShiftGenius:</p><p><a href="${confirmUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Confirm new email</a></p>${sigHtml}`,
      }
    case 'reauthentication':
      return {
        subject: `MyShiftGenius reauthentication code: ${token}`,
        text: `Your MyShiftGenius reauthentication code is:\n\n${token}\n\nEnter this code to continue.\n\n${sig}`,
        html: `<p>Your MyShiftGenius reauthentication code:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${token}</p><p style="color:#64748b;font-size:13px">Enter this code to continue.</p>${sigHtml}`,
      }
    default:
      return {
        subject: 'MyShiftGenius',
        text: `Action link:\n\n${confirmUrl}\n\n${sig}`,
        html: `<p><a href="${confirmUrl}">${confirmUrl}</a></p>${sigHtml}`,
      }
  }
}

export async function POST(request: Request) {
  const hookSecret = process.env.SUPABASE_AUTH_HOOK_SECRET
  const amKey = process.env.AGENTMAIL_API_KEY

  if (!hookSecret || !amKey) {
    console.error('[email-hook] Missing env: SUPABASE_AUTH_HOOK_SECRET or AGENTMAIL_API_KEY')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const headers = {
    'webhook-id': request.headers.get('webhook-id') ?? '',
    'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
    'webhook-signature': request.headers.get('webhook-signature') ?? '',
  }

  // Supabase dashboard shows the secret prefixed with `v1,whsec_`.
  // The standardwebhooks library expects just the `whsec_<base64>` portion.
  const normalizedSecret = hookSecret.startsWith('v1,') ? hookSecret.slice(3) : hookSecret

  let payload: Payload
  try {
    const wh = new Webhook(normalizedSecret)
    payload = wh.verify(rawBody, headers) as Payload
  } catch (err) {
    console.error('[email-hook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const { subject, text, html } = buildEmail(payload)

  const sendRes = await fetch(AGENTMAIL_SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${amKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: payload.user.email,
      subject,
      text,
      html,
    }),
  })

  if (!sendRes.ok) {
    const body = await sendRes.text()
    console.error('[email-hook] AgentMail send failed:', sendRes.status, body)
    return NextResponse.json({ error: 'Email send failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
