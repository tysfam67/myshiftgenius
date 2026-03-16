const DAYS = [
  { day: 'Mon', date: 'Mar 16' },
  { day: 'Tue', date: 'Mar 17' },
  { day: 'Wed', date: 'Mar 18' },
  { day: 'Thu', date: 'Mar 19' },
  { day: 'Fri', date: 'Mar 20' },
  { day: 'Sat', date: 'Mar 21' },
  { day: 'Sun', date: 'Mar 22' },
]

// Placeholder — fetched from Supabase by schedule_id + employee_id
const myShifts: Record<string, { shift: string; time: string; hours: number }> = {
  'Mon': { shift: 'Morning', time: '8:00 AM – 4:00 PM', hours: 8 },
  'Tue': { shift: 'Mid', time: '10:00 AM – 6:00 PM', hours: 8 },
  'Thu': { shift: 'Close', time: '2:00 PM – 10:00 PM', hours: 8 },
  'Fri': { shift: 'Morning', time: '8:00 AM – 4:00 PM', hours: 8 },
  'Sat': { shift: 'Mid', time: '10:00 AM – 6:00 PM', hours: 8 },
}

const shiftColors: Record<string, string> = {
  Opening: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  Morning: 'bg-blue-50 text-blue-800 border-blue-200',
  Mid: 'bg-green-50 text-green-800 border-green-200',
  Afternoon: 'bg-purple-50 text-purple-800 border-purple-200',
  Close: 'bg-orange-50 text-orange-800 border-orange-200',
}

export default function PortalSchedulePage() {
  const totalHours = Object.values(myShifts).reduce((s, sh) => s + sh.hours, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">My Schedule</h2>
          <p className="text-sm text-slate-500 mt-0.5">Week of March 16 – 22, 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500">&#8249;</button>
          <button className="rounded-lg p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500">&#8250;</button>
        </div>
      </div>

      {/* Week summary */}
      <div className="grid grid-cols-7 gap-3">
        {DAYS.map(({ day, date }) => {
          const shift = myShifts[day]
          return (
            <div key={day} className={`rounded-xl border p-3 text-center ${shift ? shiftColors[shift.shift] ?? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-white border-slate-100 text-slate-400'}`}>
              <p className="text-xs font-semibold uppercase tracking-wide">{day}</p>
              <p className="text-xs mt-0.5">{date}</p>
              {shift ? (
                <>
                  <p className="text-xs font-bold mt-2">{shift.shift}</p>
                  <p className="text-xs mt-0.5 opacity-70">{shift.hours}h</p>
                </>
              ) : (
                <p className="text-xs mt-2 font-medium">Off</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Detail list */}
      <div className="rounded-xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Shift Details</h3>
          <span className="text-sm text-slate-500">{totalHours} hours total</span>
        </div>
        {DAYS.map(({ day, date }) => {
          const shift = myShifts[day]
          return (
            <div key={day} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{day}, {date}</p>
                {shift ? (
                  <p className="text-xs text-slate-500 mt-0.5">{shift.shift} · {shift.time}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">Day off</p>
                )}
              </div>
              {shift ? (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${shiftColors[shift.shift] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {shift.hours}h
                </span>
              ) : (
                <span className="text-xs text-slate-300">—</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
