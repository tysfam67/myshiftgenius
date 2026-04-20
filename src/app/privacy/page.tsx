import Link from 'next/link'
import { APP_NAME, SUPPORT_EMAIL } from '@/lib/constants'

export const metadata = {
  title: 'Privacy Policy — MyShiftGenius',
  description:
    'How MyShiftGenius collects, uses, and protects franchise operator and employee data.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'April 19, 2026'
  const effective = 'April 19, 2026'

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
          <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-500">
            Last updated: {lastUpdated} · Effective: {effective}
          </p>
        </header>

        <Section title="1. Who We Are">
          <p>
            {APP_NAME} (&quot;{APP_NAME},&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
            is a franchise scheduling software product operated by FranReal LLC. This Privacy
            Policy explains what information we collect when you use our website at{' '}
            <a href="https://myshiftgenius.com" className="text-indigo-600 hover:underline">
              myshiftgenius.com
            </a>{' '}
            and our mobile applications (the &quot;Service&quot;), how we use that information,
            and the choices you have about it.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <h3>2.1 Account information</h3>
          <p>
            When a franchise owner or operator creates an account, we collect: name, email
            address, password (stored hashed, never in plain text), and the brand or business
            name they enter at signup.
          </p>

          <h3>2.2 Business and operational information</h3>
          <p>
            To generate schedules, the Service stores information you and your managers add,
            including: business locations (address, city, state, store hours, manager name),
            employee records (name, role, management tier, hourly availability, days off,
            requested hours, optionally phone or email if provided), shift templates, scheduling
            rules, generated schedules, time-off requests, and shift swap history.
          </p>

          <h3>2.3 Employee personal information</h3>
          <p>
            Employees added by an account owner or invited to the mobile app may provide their
            own availability, time-off requests, and shift preferences. Employees who are minors
            are flagged so the Service can apply applicable labor restrictions automatically.
          </p>

          <h3>2.4 Payment information</h3>
          <p>
            Subscription billing is processed by Stripe, Inc. We do not store full payment
            card numbers. We store only the last four digits and card brand for your reference,
            along with a Stripe customer identifier.
          </p>

          <h3>2.5 Technical and usage information</h3>
          <p>
            We automatically collect basic technical information when you use the Service: IP
            address, browser type and version, device type, operating system, pages viewed,
            actions taken in the app, and timestamps. We use this for security, debugging, and
            improving the product.
          </p>

          <h3>2.6 Cookies and similar technologies</h3>
          <p>
            We use a small number of cookies and local browser storage to keep you signed in,
            remember your preferences, and analyze how the Service is used. You can control
            cookies through your browser settings; disabling them may prevent you from using
            certain features.
          </p>

          <h3>2.7 Mobile push notifications</h3>
          <p>
            If you install our mobile app and grant permission, we may send push notifications
            about your schedule, shift swap requests, and time-off responses. You can disable
            push notifications in your device settings at any time.
          </p>
        </Section>

        <Section title="3. How We Use Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, maintain, and improve the Service</li>
            <li>
              Generate compliant employee schedules using artificial intelligence based on your
              rules, employee availability, and applicable labor laws
            </li>
            <li>Process subscription payments and send billing-related notifications</li>
            <li>
              Send transactional email and notifications: account confirmation, password reset,
              schedule-ready alerts, shift swap requests, and time-off responses
            </li>
            <li>Authenticate users and prevent unauthorized access</li>
            <li>Diagnose technical issues, prevent fraud, and enforce our Terms of Service</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="mt-3">
            We do not use your information or your employees&apos; information to train
            third-party advertising models. We do not sell personal information.
          </p>
        </Section>

        <Section title="4. How We Share Information">
          <p>
            We share information only with the service providers we need to operate the
            Service, and only to the extent necessary. These providers are contractually
            required to protect your information and use it only for the purposes we direct.
          </p>
          <ul>
            <li>
              <strong>Supabase, Inc.</strong> — database hosting, authentication, and file
              storage.
            </li>
            <li>
              <strong>Vercel, Inc.</strong> — website and application hosting.
            </li>
            <li>
              <strong>Stripe, Inc.</strong> — payment processing, subscription billing, and
              invoicing. Stripe&apos;s privacy policy is available at{' '}
              <a
                href="https://stripe.com/privacy"
                className="text-indigo-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                stripe.com/privacy
              </a>
              .
            </li>
            <li>
              <strong>Amazon Web Services (Amazon SES)</strong> — transactional email delivery.
            </li>
            <li>
              <strong>Anthropic, PBC</strong> — AI processing of your scheduling rules,
              employee availability, and location information to generate optimized schedules.
              Anthropic does not use this data to train its models when accessed through its
              business API.
            </li>
            <li>
              <strong>Apple, Inc. and Google LLC</strong> — mobile app distribution and push
              notification delivery if you use the iOS or Android apps.
            </li>
          </ul>
          <p className="mt-3">
            We may also share information when required by law, in response to valid legal
            process, or to protect the rights, property, or safety of {APP_NAME}, our users,
            or others. If {APP_NAME} or its parent company is involved in a merger, acquisition,
            or sale of assets, your information may be transferred as part of that transaction;
            we will notify you before your information becomes subject to a different privacy
            policy.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your account information and operational data for as long as your account
            is active. If you cancel your subscription, we retain your data for 90 days in case
            you choose to reactivate, then we delete it. You may request earlier deletion at
            any time by contacting{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            . Backup copies are purged within 30 days of deletion.
          </p>
          <p className="mt-3">
            We retain billing records for the period required by applicable tax and accounting
            laws, typically seven years.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p>
            You have the following rights regarding your personal information:
          </p>
          <ul>
            <li>
              <strong>Access</strong> — request a copy of the personal information we hold
              about you.
            </li>
            <li>
              <strong>Correction</strong> — ask us to correct inaccurate information.
            </li>
            <li>
              <strong>Deletion</strong> — request that we delete your information, subject to
              legal retention requirements.
            </li>
            <li>
              <strong>Export</strong> — receive your data in a machine-readable format.
            </li>
            <li>
              <strong>Opt out of marketing</strong> — although we do not currently send
              marketing email, you can unsubscribe from any communication at any time.
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            . We respond within 30 days.
          </p>

          <h3>6.1 California residents</h3>
          <p>
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act
            (CPRA), California residents have the rights described above plus the right to know
            what categories of personal information we collect and the right not to be
            discriminated against for exercising any of these rights. We do not sell or share
            personal information for cross-context behavioral advertising.
          </p>

          <h3>6.2 European and UK residents</h3>
          <p>
            Under the GDPR and UK GDPR, individuals in the European Economic Area, the United
            Kingdom, and Switzerland have the rights described above plus the right to lodge a
            complaint with a supervisory authority. Our legal basis for processing is the
            performance of a contract (operating the Service), our legitimate interests
            (security, fraud prevention, product improvement), or your consent (push
            notifications).
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p>
            The Service is intended for use by businesses, not directly by children. Account
            owners and managers may add records for employees who are minors (typically aged
            14–17 in the United States) so the Service can apply legally required labor
            restrictions to their schedules.
          </p>
          <p className="mt-3">
            We do not knowingly collect personal information from anyone under the age of 13. If
            you believe we have inadvertently collected information from a child under 13,
            please contact{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>{' '}
            and we will delete it.
          </p>
        </Section>

        <Section title="8. Security">
          <p>
            We protect your information using industry-standard practices: TLS encryption for
            all data in transit, encryption at rest in our database, role-based access controls,
            row-level security on multi-tenant data, and regular security reviews. Stripe
            handles all payment card data under PCI-DSS Level 1 certification.
          </p>
          <p className="mt-3">
            No system is perfectly secure. If we become aware of a security incident affecting
            your information, we will notify affected users and applicable regulators as
            required by law.
          </p>
        </Section>

        <Section title="9. International Data Transfers">
          <p>
            {APP_NAME} is operated from the United States and our service providers are
            primarily located in the United States. If you access the Service from outside the
            United States, you understand that your information will be transferred to and
            processed in the United States.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. If we make material changes,
            we will notify you by email or through an in-app notice at least 30 days before the
            changes take effect. The &quot;Last updated&quot; date at the top of this page
            indicates when the policy was most recently revised.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            Questions, concerns, or requests about this Privacy Policy or your personal
            information should be sent to:
          </p>
          <p className="mt-3">
            <strong>{APP_NAME}</strong>
            <br />
            FranReal LLC
            <br />
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </Section>

        <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-slate-500">
          <p>
            See also our{' '}
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
            <Link href="/auth/login" className="hover:text-slate-700">
              Sign in
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
