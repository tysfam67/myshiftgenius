export const PRICE_PER_LOCATION = 49
export const FOUNDERS_PRICE_PER_LOCATION = 39
export const TRIAL_DAYS = 30
export const APP_NAME = 'MyShiftGenius'
export const APP_URL = 'https://myshiftgenius.com'
export const SUPPORT_EMAIL = 'support@myshiftgenius.com'

// Founders pricing locks at $39/location/month for everyone who subscribes
// before this cutoff. Nov 1 2026 00:00 UTC = founders runs through end of Oct.
export const FOUNDERS_CUTOFF_MS = Date.UTC(2026, 10, 1, 0, 0, 0)
export function foundersStillAvailable(now: number = Date.now()): boolean {
  return now < FOUNDERS_CUTOFF_MS
}

export const MANAGEMENT_TIERS = [
  { value: 'GM', label: 'General Manager' },
  { value: 'AM', label: 'Assistant Manager' },
  { value: 'SL', label: 'Shift Lead' },
  { value: 'TM', label: 'Team Member' },
]

export const OPERATIONAL_ROLES = [
  'Sandwich Maker', 'Deli Slicer', 'Cashier', 'Assembler',
  'Cook', 'Server', 'Barista', 'Supervisor', 'General',
]

export const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard',  icon: 'LayoutDashboard' },
  { href: '/locations',  label: 'Locations',  icon: 'MapPin' },
  { href: '/employees',  label: 'Employees',  icon: 'Users' },
  { href: '/rules',      label: 'Rules',      icon: 'Settings' },
  { href: '/schedule',   label: 'Schedule',   icon: 'Calendar' },
  { href: '/time-off',   label: 'Time Off',   icon: 'CalendarOff' },
]
