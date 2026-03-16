import { CheckCircle, XCircle, Clock } from 'lucide-react'

// Placeholder — will be fetched from Supabase
const requests = [
  { id: 1, employee: 'Jane Smith', location: 'Hauppauge #1', type: 'Full Day', date: 'Mar 25, 2026', reason: 'Family event', status: 'pending', submitted: 'Mar 10' },
  { id: 2, employee: 'Carlos Rivera', location: 'Bay Shore #6', type: 'Full Day', date: 'Mar 22, 2026', reason: 'Medical', status: 'pending', submitted: 'Mar 9' },
  { id: 3, employee: 'Aisha Johnson', location: 'Smithtown #7', type: 'Partial', date: 'Mar 20, 2026', reason: 'Appointment 8–11 AM', status: 'pending', submitted: 'Mar 9' },
  { id: 4, employee: 'Mike Torres', location: 'Hauppauge #1', type: 'Full Day', date: 'Mar 18, 2026', reason: '', status: 'approved', submitted: 'Mar 7' },
  { id: 5, employee: 'Sarah Lee', location: 'Deer Park #4', type: 'Full Day', date: 'Mar 15, 2026', reason: 'Vacation', status: 'denied', submitted: 'Mar 5' },
]

const statusBadge = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-green-50 text-green-700',
  denied: 'bg-red-50 text-red-700',
}

export default function TimeOffManagerPage() {
  const pending = requests.filter(r => r.status === 'pending')
  const resolved = requests.filter(r => r.status !== 'pending')

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Time-Off Requests</h1>
        <p className="text-slate-500 mt-1">Review and approve or deny employee requests</p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Needs Review ({pending.length})
          </h2>
          <div className="rounded-xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-50">
            {pending.map(req => (
              <div key={req.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{req.employee}</p>
                    <span className="text-xs text-slate-400">·</span>
                    <p className="text-xs text-slate-500">{req.location}</p>
                  </div>
                  <p className="text-sm text-slate-700 mt-0.5">
                    {req.type} off — <strong>{req.date}</strong>
                  </p>
                  {req.reason && (
                    <p className="text-xs text-slate-400 mt-0.5 italic">{req.reason}</p>
                  )}
                  <p className="text-xs text-slate-300 mt-1">Submitted {req.submitted}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <form action={`/api/time-off/${req.id}/approve`} method="POST">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Approve
                    </button>
                  </form>
                  <form action={`/api/time-off/${req.id}/deny`} method="POST">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg bg-white border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Deny
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolved */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Recent History
        </h2>
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-50">
          {resolved.map(req => (
            <div key={req.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900">{req.employee}</p>
                  <span className="text-xs text-slate-400">·</span>
                  <p className="text-xs text-slate-500">{req.location}</p>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  {req.type} off — {req.date}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[req.status as keyof typeof statusBadge]}`}>
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
