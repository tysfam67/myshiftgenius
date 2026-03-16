import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import { Calendar, Clock, LayoutDashboard, LogOut } from 'lucide-react'

const portalNav = [
  { href: '/portal/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/portal/schedule', label: 'My Schedule', icon: Calendar },
  { href: '/portal/availability', label: 'My Availability', icon: Clock },
  { href: '/portal/time-off', label: 'Time Off', icon: Calendar },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-indigo-600">{APP_NAME}</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500">Employee Portal</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">Jane Smith</span>
            <span className="text-slate-300">·</span>
            <span>Location #1</span>
            <Link href="/portal" className="ml-3 flex items-center gap-1 text-slate-400 hover:text-slate-600">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Tab nav */}
        <nav className="flex gap-1 mb-8 bg-white rounded-xl border border-slate-100 shadow-sm p-1.5 w-fit">
          {portalNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  )
}
