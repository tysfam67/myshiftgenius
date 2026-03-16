export type BillingTier = 'trial' | 'active' | 'cancelled'

export interface Client {
  id: string
  name: string
  brand: string
  contact_name: string
  contact_email: string
  notify_email: string
  billing_tier: BillingTier
  stripe_customer_id?: string
  trial_ends_at?: string
  created_at: string
  active: boolean
}

export interface Location {
  id: string
  client_id: string
  name?: string
  address: string
  city: string
  state: string
  zip: string
  lat?: number
  lon?: number
  manager_name?: string
  manager_email?: string
  phone?: string
  active: boolean
}

export type EmployeeType = 'fulltime' | 'parttime'
export type ManagementTier = 'GM' | 'AM' | 'SL' | 'TM'

export interface Employee {
  id: string
  client_id: string
  location_id: string
  name: string
  email?: string
  phone?: string
  roles: string[]
  management_tier: ManagementTier
  operational_role: string
  type: EmployeeType
  exact_hours: boolean
  minor: boolean
  home_zip?: string
  days_off: string[]
  active: boolean
  created_at: string
}

export interface SchedulingRules {
  id: string
  client_id: string
  // Hours & Shifts
  min_hours_per_week: number
  max_hours_per_week: number
  min_shifts_per_week: number
  max_shifts_per_week: number
  max_consecutive_days: number
  min_days_off_per_week: number
  // Store Hours
  store_open: string
  store_close: string
  schedule_horizon_weeks: number
  // Shift Templates
  shifts: Record<string, ShiftDef>
  // Coverage Requirements
  coverage: CoverageRule[]
  // Minor Rules
  minor_max_hours_per_week: number
  minor_max_hours_per_day: number
  minor_latest_shift_end: string
  // Preferences
  prefer_consistent_shifts: boolean
  prefer_no_clopening: boolean   // no close → open next day
  clopening_min_gap_hours: number
  // Per-location overrides keyed by location_id
  location_overrides: Record<string, Partial<SchedulingRules>>
}

export interface ShiftDef {
  label: string
  start: string
  end: string
  hours: number
  min_role?: string
}

export interface CoverageRule {
  shift_label: string        // e.g. 'Morning'
  day_type: 'weekday' | 'weekend' | 'all'
  min_staff: number
  required_roles: string[]   // at least one of these roles must be present
}

export interface Schedule {
  id: string
  client_id: string
  location_id: string
  week_start: string
  status: 'pending' | 'generated' | 'published'
  published_url?: string
  published_at?: string
  created_at: string
}

export interface ScheduleShift {
  id: string
  schedule_id: string
  employee_id: string
  date: string         // YYYY-MM-DD
  shift_key: string    // key into SchedulingRules.shifts
  start_time: string
  end_time: string
  hours: number
}

// ── Employee Portal ──────────────────────────────────────────────

export type TimeOffStatus = 'pending' | 'approved' | 'denied'
export type TimeOffType = 'full_day' | 'partial'

export interface TimeOffRequest {
  id: string
  employee_id: string
  client_id: string
  location_id: string
  type: TimeOffType
  date: string           // YYYY-MM-DD
  start_time?: string    // for partial
  end_time?: string      // for partial
  reason?: string
  status: TimeOffStatus
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export interface RecurringUnavailability {
  id: string
  employee_id: string
  day_of_week: DayOfWeek
  unavailable_all_day: boolean
  unavailable_before?: string  // HH:MM — can't work before this time
  unavailable_after?: string   // HH:MM — can't work after this time
  note?: string
}

export interface PortalSession {
  employee_id: string
  employee_name: string
  location_id: string
  client_id: string
  brand: string
  token: string
  expires_at: string
}
