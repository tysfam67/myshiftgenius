import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export default function PortalLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-indigo-600">{APP_NAME}</span>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Employee Portal</h1>
          <p className="mt-1 text-slate-500 text-sm">
            Enter your work email to receive a sign-in link
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form className="space-y-5" action="/api/portal/send-link" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Your work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="jane@example.com"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Must match the email your manager has on file
              </p>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Send me a sign-in link
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account? Ask your manager to add your email.
        </p>
      </div>
    </div>
  )
}
