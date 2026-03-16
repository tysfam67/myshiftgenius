'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS, APP_NAME } from '@/lib/constants'
import { LayoutDashboard, MapPin, Users, Settings, Calendar, CalendarOff } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  MapPin,
  Users,
  Settings,
  Calendar,
  CalendarOff,
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-100 bg-white">
      <div className="px-6 py-5 border-b border-slate-100">
        <span className="text-lg font-bold text-indigo-600">{APP_NAME}</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const Icon = iconMap[item.icon]
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-slate-100">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="block w-full rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 text-center"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
