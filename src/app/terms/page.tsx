import Link from 'next/link'
import { APP_NAME, SUPPORT_EMAIL } from '@/lib/constants'

export const metadata = {
  title: 'Terms of Service — MyShiftGenius',
  description:
    'The terms governing your use of MyShiftGenius franchise scheduling software.',
}

export default function TermsPage() {
  const lastUpdated = 'April 25, 2026'
  const effective = 'April 25, 2026'

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
          <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
          <p className="mt-3 text-sm text-slate-500">
            Last updated: {lastUpdated} · Effective: {effective}
          </p>
        </header>

        <Section title="1. Agreement">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of{' '}
            {APP_NAME} (the &quot;Service&quot;), operated by FranReal LLC. By creating an
            account, accessing the website at{' '}
            <a href="https://myshiftgenius.com" className="text-indigo-600 hover:underline">
              myshiftgenius.com
            </a>
            , or using our mobile applications, you agree to these Terms. If you don&apos;t
            agree, don&apos;t use the Service.
          </p>
        </Section>

        <Section title="2. Accounts">
          <p>
            You must be at least 18 years old and authorized to bind your business to these
            Terms. You are responsible for keeping your account credentials secure and for all
            activity that happens under your account. Tell us right away at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>{' '}
            if you suspect unauthorized access.
          </p>
        </Section>

        <Section title="3. Subscriptions, billing, and trial">
          <p>
            The Service is offered as a paid subscription billed per location, per month, by
            Stripe. New accounts may receive a 30-day free trial without entering payment
            information; after the trial, an active subscription is required to continue using
            the Service.
          </p>
          <p className="mt-3">
            <strong>Founders pricing.</strong> Subscribers who start before November 1, 2026 are
            locked in at $39/location/month for as long as their subscription remains active and
            continuous. Standard pricing of $49/location/month applies to new subscriptions
            started after the founders window closes, and to any reactivated subscription that
            was previously cancelled.
          </p>
          <p className="mt-3">
            Subscriptions renew automatically each month until cancelled. You can cancel at any
            time from the billing portal in your dashboard or by emailing{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            . On cancellation, your access continues through the end of the paid period.
          </p>
          <p className="mt-3">
            Fees are non-refundable except where required by law. We may change pricing for
            future billing periods with at least 30 days&apos; notice; the founders rate is
            exempt from such changes for as long as it remains active.
          </p>
        </Section>

        <Section title="4. Acceptable use">
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for unlawful purposes or in violation of labor laws</li>
            <li>
              Reverse engineer, decompile, or attempt to extract the source code of the Service
              except as permitted by law
            </li>
            <li>
              Resell, sublicense, or white-label the Service without our written agreement
            </li>
            <li>
              Upload information about employees that you don&apos;t have authority to enter
              into a third-party scheduling system
            </li>
            <li>
              Send unsolicited email or notifications to employees through the Service
            </li>
            <li>
              Probe, scan, or test the security of the Service or interfere with its operation
            </li>
            <li>
              Use the Service to train competing artificial intelligence models
            </li>
          </ul>
        </Section>

        <Section title="5. Your content and our rights">
          <p>
            You retain ownership of the data you upload — locations, employees, schedules,
            rules, time-off requests, and so on. You grant {APP_NAME} a limited license to host,
            process, and display this data solely to operate the Service for you, including
            generating schedules using AI processing as described in our{' '}
            <Link href="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="mt-3">
            We own the Service itself, including the software, branding, AI models and prompts,
            and all derivative works. Nothing in these Terms transfers any of those rights to
            you.
          </p>
        </Section>

        <Section title="6. AI-generated schedules">
          <p>
            The Service uses artificial intelligence to draft schedules from the rules and
            availability you provide. AI output may contain errors and is not a substitute for
            professional review. <strong>You are responsible for reviewing every schedule
            before publishing it</strong> to confirm it complies with the labor laws applicable
            to your business and your jurisdictions. {APP_NAME} does not provide legal advice
            and is not liable for scheduling decisions you make.
          </p>
        </Section>

        <Section title="7. Service availability">
          <p>
            We aim for high availability but do not guarantee uninterrupted service. We may
            perform maintenance, deploy updates, or experience outages. We will not be liable
            for downtime, but if a multi-day outage materially affects your use of the Service,
            email us and we&apos;ll work out a fair credit.
          </p>
        </Section>

        <Section title="8. Termination">
          <p>
            You may stop using the Service and cancel your subscription at any time. We may
            suspend or terminate your account if you violate these Terms, fail to pay, or use
            the Service in a way that creates risk for us or other users. On termination, your
            data is retained for 90 days during which you can reactivate, then deleted as
            described in our Privacy Policy.
          </p>
        </Section>

        <Section title="9. Disclaimers">
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTY ARISING FROM
            COURSE OF DEALING OR USAGE OF TRADE. WE DO NOT WARRANT THAT THE SERVICE WILL BE
            ERROR-FREE OR THAT AI-GENERATED SCHEDULES WILL BE ACCURATE OR LEGALLY COMPLIANT IN
            YOUR JURISDICTION.
          </p>
        </Section>

        <Section title="10. Limitation of liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL {APP_NAME.toUpperCase()},
            FRANREAL LLC, OR THEIR OFFICERS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST
            REVENUE, LOST DATA, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATED TO YOUR USE
            OF THE SERVICE, EVEN IF WE&apos;VE BEEN ADVISED OF THE POSSIBILITY. OUR TOTAL
            CUMULATIVE LIABILITY FOR ANY CLAIM RELATED TO THE SERVICE WILL NOT EXCEED THE
            AMOUNTS YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
          </p>
        </Section>

        <Section title="11. Indemnification">
          <p>
            You will indemnify and hold {APP_NAME} and FranReal LLC harmless from any claim,
            loss, or expense (including reasonable attorneys&apos; fees) arising out of your
            misuse of the Service, your violation of these Terms, or your violation of any law
            or third-party right (including labor laws applicable to schedules you publish).
          </p>
        </Section>

        <Section title="12. Governing law and disputes">
          <p>
            These Terms are governed by the laws of the State of Arizona, without regard to
            conflict-of-law rules. Any dispute arising out of or related to these Terms or the
            Service will be resolved exclusively in the state or federal courts located in
            Maricopa County, Arizona, and you consent to personal jurisdiction there. Nothing
            in this section prevents either party from seeking equitable relief in any court of
            competent jurisdiction.
          </p>
        </Section>

        <Section title="13. Changes to these Terms">
          <p>
            We may update these Terms from time to time. If we make material changes, we&apos;ll
            notify you by email or through the Service at least 30 days before the changes take
            effect. Your continued use of the Service after the effective date constitutes
            acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="14. Contact">
          <p>
            Questions about these Terms?
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
            <Link href="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/support" className="text-indigo-600 hover:underline">
              Support
            </Link>{' '}
            page.
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
