import Link from 'next/link'
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

// Placeholder data — will come from Supabase session + queries
const upcomingShifts = [
  { date: 'Mon Mar 16', shift: 'Morning', time: '8:00 AM – 4:00 PM', hours: 8 },
  { date: 'Tue Mar 17', shift: 'Mid', time: '10:00 AM – 6:00 PM', hours: 8 },
  { date: 'Thu Mar 19', shift: 'Close', time: '2:00 PM – 10:00 PM', hours: 8 },
  { date: 'Fri Mar 20', shift: 'Morning', time: '8:00 AM – 4:00 PM', hours: 8 },
  { date: 'Sat Mar 21', shift: 'Mid', time: '10:00 AM – 6:00 PM', hours: 8 },
]

const pendingRequests = [
  { id: 1, type: 'Day Off', date: 'Wed Mar 25', status: 'pending' },
]

export default function PortalDashboard() {
  const totalHours = upcomingShifts.reduce((s, sh) => s + sh.hours, 0)

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-5">
          <p className="text-sm text-slate-500">This week</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{upcomingShifts.filter(s => {
            // placeholder — would filter by week
            return true
          }).length} shifts</p>
          <p className="text-sm text-slate-400 mt-1">{totalHours} hours scheduled</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-5">
          <p className="text-sm text-slate-500">Pending requests</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{pendingRequests.length}</p>
          <p className="text-sm text-slate-400 mt-1">awaiting manager review</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-5">
          <p className="text-sm text-slate-500">Next shift</p>
          <p className="text-lg font-bold text-slate-900 mt-1">{upcomingShifts[0]?.date}</p>
          <p className="text-sm text-slate-400 mt-1">{upcomingShifts[0]?.time}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming shifts */}
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Upcoming Shifts</h2>
            <Link href="/portal/schedule" className="text-sm text-indigo-600 hover:text-indigo-700">
              View full schedule →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingShifts.map((shift, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{shift.date}</p>
                  <p className="text-xs text-slate-500">{shift.shift} · {shift.time}</p>
                </div>
                <span className="text-sm font-medium text-slate-700">{shift.hours}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions + pending */}
        <div className="space-y-4">
          <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/portal/time-off" className="flex items-center gap-3 rounded-lg border border-slate-200 p-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Request a day off
              </Link>
              <Link href="/portal/availability" className="flex items-center gap-3 rounded-lg border border-slate-200 p-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Clock className="h-5 w-5 text-indigo-500" />
                Update my availability
              </Link>
            </div>
          </div>

          {pendingRequests.length > 0 && (
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Pending Requests</h2>
              <div className="space-y-3">
                {pendingRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{req.type}</p>
                      <p className="text-xs text-slate-500">{req.date}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <AlertCircle className="h-3 w-3" />
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
