import Link from 'next/link'
import { APP_NAME, SUPPORT_EMAIL } from '@/lib/constants'

export const metadata = {
  title: 'Contact — MyShiftGenius',
  description:
    'Get in touch with the MyShiftGenius team. Email support, sales, and partnerships.',
}

export default function ContactPage() {
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
          <h1 className="text-4xl font-bold text-slate-900">Contact us</h1>
          <p className="mt-3 text-slate-600">
            Real people, real responses. We answer every email personally.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          <ContactCard
            label="Support"
            description="Help with your account, bugs, or how-to questions."
            email={SUPPORT_EMAIL}
          />
          <ContactCard
            label="Sales"
            description="Multi-location pricing, demos, or franchise-wide rollouts."
            email={SUPPORT_EMAIL}
          />
          <ContactCard
            label="Partnerships"
            description="Franchise brands, payroll integrations, or referral partners."
            email={SUPPORT_EMAIL}
          />
          <ContactCard
            label="Press &amp; legal"
            description="Press inquiries, legal notices, and abuse reports."
            email={SUPPORT_EMAIL}
          />
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Mailing address</h2>
          <div className="text-slate-700 leading-relaxed">
            <p>
              <strong>{APP_NAME}</strong>
              <br />
              FranReal LLC
              <br />
              Phoenix, Arizona, USA
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Response times</h2>
          <p className="text-slate-700 leading-relaxed">
            We aim to respond within one business day. If you&apos;re reporting an outage or
            something that&apos;s blocking you from publishing a schedule, mark the email{' '}
            <strong>URGENT</strong> in the subject line and we&apos;ll prioritize it.
          </p>
        </section>

        <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-slate-500">
          <p>
            See our{' '}
            <Link href="/support" className="text-indigo-600 hover:underline">
              Support
            </Link>{' '}
            page for common questions, or our{' '}
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

function ContactCard({
  label,
  description,
  email,
}: {
  label: string
  description: string
  email: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900" dangerouslySetInnerHTML={{ __html: label }} />
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <a
        href={`mailto:${email}`}
        className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
      >
        {email}
      </a>
    </div>
  )
}
