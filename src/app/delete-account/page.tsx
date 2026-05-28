import Link from 'next/link'
import { APP_NAME, SUPPORT_EMAIL } from '@/lib/constants'

export const metadata = {
  title: 'Delete your account — MyShiftGenius',
  description:
    'How to permanently delete your MyShiftGenius account and all associated data.',
}

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-slate-600 hover:text-slate-900">
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Delete your account</h1>
          <p className="mt-3 text-slate-600">
            You can permanently delete your {APP_NAME} account and all associated data at any
            time. This page explains how.
          </p>
        </header>

        <Section title="What gets deleted">
          <p>When you request account deletion, we permanently remove:</p>
          <ul>
            <li>Your account profile (name, email, password)</li>
            <li>Your business and location records</li>
            <li>All employee records you added</li>
            <li>All schedules you generated, published, or shared</li>
            <li>Scheduling rules, shift templates, and configuration</li>
            <li>Time-off requests and shift swap history</li>
            <li>Activity logs tied to your account</li>
          </ul>
          <p className="mt-3">
            Data is removed from our active database immediately on confirmation. Encrypted
            backups are purged within <strong>30 days</strong>.
          </p>
        </Section>

        <Section title="What we keep (and why)">
          <p>
            We retain a minimal record of completed transactions for tax and accounting
            compliance, typically <strong>seven years</strong> as required by law. This includes:
          </p>
          <ul>
            <li>
              Stripe billing records (receipts, invoices) — these are held by Stripe under their
              standard retention; we do not store full payment information ourselves.
            </li>
            <li>
              Anonymized aggregate usage statistics that cannot be tied back to your account.
            </li>
          </ul>
          <p className="mt-3">
            We do not retain personally identifiable information beyond these compliance
            requirements.
          </p>
        </Section>

        <Section title="How to request deletion">
          <h3>Option 1 — Email us (works for any account)</h3>
          <p>
            Send an email to{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Delete%20my%20account`}
              className="text-indigo-600 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>{' '}
            from the email address tied to your account, with the subject line{' '}
            <strong>&quot;Delete my account.&quot;</strong> We will:
          </p>
          <ol>
            <li>Confirm the request by replying to the same email address (within 1 business day)</li>
            <li>Pause your subscription if active and process any final invoice</li>
            <li>Delete your data from production within 7 days of confirmation</li>
            <li>Confirm completion by email when finished</li>
          </ol>

          <h3>Option 2 — Cancel and let it auto-delete</h3>
          <p>
            If you cancel your subscription from the billing portal in your dashboard, your
            account stays accessible for <strong>90 days</strong> in case you reactivate. After
            90 days of continuous inactivity post-cancellation, your data is automatically
            deleted following the same schedule as Option 1.
          </p>
        </Section>

        <Section title="If you can't sign in">
          <p>
            If you have lost access to the email tied to your account, email{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>{' '}
            from any address you can verify (a corporate or franchise email is best). We will
            verify your identity with a few questions about your account before processing the
            deletion request.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            For any questions about deletion, retention, or your data rights, see our{' '}
            <Link href="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </Link>{' '}
            or email{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </article>

      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-sm text-slate-500">
          <span>
            &copy; {new Date().getFullYear()} {APP_NAME}
          </span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-slate-700">
              Pricing
            </Link>
            <Link href="/privacy" className="hover:text-slate-700">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-700">
              Terms
            </Link>
            <Link href="/support" className="hover:text-slate-700">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
      <div className="prose prose-slate text-slate-700 leading-relaxed text-[15px] [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1.5">
        {children}
      </div>
    </section>
  )
}
