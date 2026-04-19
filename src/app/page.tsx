import Link from 'next/link'
import { APP_NAME, PRICE_PER_LOCATION, TRIAL_DAYS } from '@/lib/constants'
import { Calendar, Users, Settings, MapPin, CheckCircle, Zap, Shield, Clock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">{APP_NAME}</span>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">Pricing</Link>
            <Link href="/auth/login" className="text-sm text-slate-600 hover:text-slate-900">Sign in</Link>
            <Link href="/auth/signup" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
          <Zap className="h-4 w-4" />
          AI-powered franchise scheduling
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Schedules that just work.<br />
          <span className="text-indigo-600">Every single week.</span>
        </h1>
        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
          Stop spending hours building schedules in spreadsheets. {APP_NAME} generates
          compliant, optimized schedules for your entire franchise — in seconds.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/auth/signup" className="rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-indigo-700">
            Start your {TRIAL_DAYS}-day free trial
          </Link>
          <Link href="/pricing" className="rounded-xl border border-slate-200 px-8 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50">
            See pricing
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">No credit card required. Cancel anytime.</p>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">
            Everything you need to run a tight operation
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Calendar, title: 'Smart Scheduling', desc: 'AI respects availability, hours caps, days off, and consecutive day limits automatically.' },
              { icon: Users, title: 'Team Management', desc: 'Track every employee across all locations — roles, hours, and management tier in one place.' },
              { icon: MapPin, title: 'Multi-Location', desc: 'Manage dozens of locations from a single dashboard. Each gets its own compliant schedule.' },
              { icon: Settings, title: 'Custom Rules', desc: 'Set your own min/max hours, shift templates, and labor rules. George enforces them all.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="rounded-lg bg-indigo-50 p-3 w-fit mb-4">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl bg-indigo-600 p-10 text-center text-white">
            <p className="text-2xl font-medium leading-relaxed">
              &ldquo;I used to spend Sunday nights building next week&rsquo;s schedule. Now I click
              a button and it&rsquo;s done. The AI actually understands labor compliance.&rdquo;
            </p>
            <p className="mt-4 text-indigo-200">— Franchise operator, 9 locations</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">Get up and running in minutes</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { step: '1', title: 'Add your locations & team', desc: 'Import employees, set their roles, availability, and scheduling preferences.' },
              { step: '2', title: 'Configure your rules', desc: 'Set store hours, shift templates, max hours, and any compliance requirements.' },
              { step: '3', title: 'Generate & publish', desc: 'One click generates your full schedule. Share a link with your team instantly.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                  {step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Simple, transparent pricing</h2>
          <p className="mt-4 text-slate-600">
            Just ${PRICE_PER_LOCATION}/location/month. No per-user fees, no hidden costs.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-600">
            {['Unlimited employees', 'AI schedule generation', 'Publish & share links', 'Email notifications'].map(f => (
              <span key={f} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {f}
              </span>
            ))}
          </div>
          <Link href="/auth/signup" className="mt-8 inline-block rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white hover:bg-indigo-700">
            Start free — {TRIAL_DAYS} days on us
          </Link>
        </div>
      </section>

      {/* App download */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white">Your team manages their schedule on the go</h2>
          <p className="mt-3 text-slate-400">
            Employees view shifts, request time off, and swap shifts right from their phone.
            Free download for iOS and Android.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://apps.apple.com/app/myshiftgenius/id6746296939"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-slate-500 leading-none">Download on the</div>
                <div className="text-sm font-bold leading-tight">App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.myshiftgenius.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.3.17.64.24.99.2L15.34 12 11.54 8.2 3.18 23.76zm17.62-11.45L17.9 10.6l-3.34 3.34 3.34 3.34 2.92-1.65c.83-.47.83-1.65-.02-2.12zM3 .56C2.68.73 2.5 1.08 2.5 1.5v21c0 .42.18.77.5.94l.1.06 11.78-11.78v-.27L3.1.5 3 .56zm8.54 11.66L3.18.24c.35-.04.69.03.99.2l8.36 15.53-3-3.75z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-slate-500 leading-none">Get it on</div>
                <div className="text-sm font-bold leading-tight">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-sm text-slate-500">
          <span>&copy; {new Date().getFullYear()} {APP_NAME}</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-slate-700">Pricing</Link>
            <Link href="/auth/login" className="hover:text-slate-700">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
