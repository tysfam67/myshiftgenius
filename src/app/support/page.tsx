import Link from 'next/link'
import { APP_NAME, SUPPORT_EMAIL } from '@/lib/constants'

export const metadata = {
  title: 'Support — MyShiftGenius',
  description:
    'Get help with MyShiftGenius — contact support, find answers, and learn how to get the most out of your franchise scheduling software.',
}

export default function SupportPage() {
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
            <Link
              href="/auth/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Support</h1>
          <p className="mt-3 text-slate-600">
            We respond to every email personally, usually within one business day.
          </p>
        </header>

        <Section title="Contact us">
          <p>
            The fastest way to reach us is by email:
          </p>
          <p className="mt-3">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-lg font-semibold text-indigo-600 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p className="mt-3">
            Tell us your brand name, the locations affected, and a screenshot if relevant.
            That gets us to a fix faster.
          </p>
        </Section>

        <Section title="Common questions">
          <h3>How do I add a location?</h3>
          <p>
            Sign in, open the <strong>Locations</strong> tab, and click <strong>Add
            location</strong>. You&apos;ll need an address, store hours, and a manager name. The
            location gets a short ID (like <code>jm_001</code>) automatically.
          </p>

          <h3>How do I add employees?</h3>
          <p>
            From the <strong>Employees</strong> tab, click <strong>Add employee</strong>. Enter
            their name, role, availability, and any constraints (max hours, days off, minor
            status). For larger teams, CSV import is on the roadmap.
          </p>

          <h3>How do I generate a schedule?</h3>
          <p>
            Configure your rules in the <strong>Rules</strong> tab first — store hours, shift
            templates, and labor compliance. Then open <strong>Schedule</strong>, pick a week,
            and click <strong>Generate</strong>. The AI builds a draft you can review and
            publish.
          </p>

          <h3>How does billing work?</h3>
          <p>
            Subscriptions are processed by Stripe at $39/location/month (founders pricing locked
            through October 31, 2026 for anyone who signs up before the cutoff). After the
            founders window, the standard rate is $49/location/month. New accounts get a 30-day
            free trial — no credit card required.
          </p>

          <h3>How do I cancel?</h3>
          <p>
            From the <strong>Billing</strong> page in your dashboard, click <strong>Manage
            subscription</strong>. You&apos;ll be redirected to Stripe&apos;s billing portal
            where you can cancel at any time. Your account stays active until the end of the
            current billing period. After cancellation, your data is retained for 90 days in
            case you reactivate, then deleted.
          </p>

          <h3>I lost access to my account.</h3>
          <p>
            Use the <Link href="/auth/login" className="text-indigo-600 hover:underline">password
            reset link</Link> on the sign-in page. If the email associated with your account is
            no longer reachable, email{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>{' '}
            from a verifiable address (ideally your franchise corporate domain) and we&apos;ll
            help you recover it.
          </p>

          <h3>Can I use MyShiftGenius for a non-franchise business?</h3>
          <p>
            Yes. The product is built around franchise operators, but any small or multi-location
            business that needs schedule generation, availability tracking, and shift management
            can use it. Pick the business type that best matches yours at signup.
          </p>
        </Section>

        <Section title="Status &amp; outages">
          <p>
            If something looks broken, check{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>{' '}
            first — we usually post known issues there or reply with an ETA. We don&apos;t run a
            public status page yet; that&apos;s on the roadmap.
          </p>
        </Section>

        <Section title="Feature requests &amp; feedback">
          <p>
            We read every email. If there&apos;s a feature you need to make MyShiftGenius work
            for your business, tell us — many of the features in the product today came from
            franchise operators asking for them.
          </p>
        </Section>

        <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-slate-500">
          <p>
            See also our{' '}
            <Link href="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="text-indigo-600 hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
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
      <div className="prose prose-slate text-slate-700 leading-relaxed text-[15px] [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_li]:mb-1.5">
        {children}
      </div>
    </section>
  )
}
