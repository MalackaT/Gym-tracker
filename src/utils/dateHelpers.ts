export const YEAR = 2026;
export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const WORKOUT_TYPES = [
  'Cardio', 'Strength', 'HIIT', 'Yoga', 'Swimming', 'Cycling', 'Other',
] as const;

export type WorkoutType = (typeof WORKOUT_TYPES)[number];

export interface Session {
  type: WorkoutType;
  note: string;
}

export interface GymData {
  sessions: Record<string, Session>;
  weeklyGoal: number;
  bestStreak: number;
}

export function formatDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function todayStr(): string {
  const t = new Date();
  return formatDate(t.getFullYear(), t.getMonth(), t.getDate());
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns 0=Mon .. 6=Sun for the first day of the month */
export function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // convert Sun=0 to Mon-based
}

export interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
}

export function getMonthCalendar(year: number, month: number): CalendarDay[][] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const days: CalendarDay[] = [];

  // Previous month padding
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevDays = getDaysInMonth(prevYear, prevMonth);
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevDays - i;
    days.push({ date: formatDate(prevYear, prevMonth, d), day: d, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: formatDate(year, month, d), day: d, isCurrentMonth: true });
  }

  // Next month padding
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: formatDate(nextYear, nextMonth, d), day: d, isCurrentMonth: false });
    }
  }

  // Split into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function calculateCurrentStreak(sessions: Record<string, Session>): number {
  const today = new Date();
  let streak = 0;
  const d = new Date(today);

  // If today has no session, start checking from yesterday
  if (!sessions[formatDate(d.getFullYear(), d.getMonth(), d.getDate())]) {
    d.setDate(d.getDate() - 1);
  }

  while (true) {
    const key = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
    if (sessions[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function calculateBestStreak(sessions: Record<string, Session>, year: number): number {
  let best = 0;
  let current = 0;
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
    if (sessions[key]) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }
  return best;
}

export function getWeekSessionCount(sessions: Record<string, Session>): number {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
    if (sessions[key]) count++;
  }
  return count;
}

export function getMonthSessionCount(sessions: Record<string, Session>, year: number, month: number): number {
  const daysInMonth = getDaysInMonth(year, month);
  let count = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    if (sessions[formatDate(year, month, d)]) count++;
  }
  return count;
}

export function getYearSessionCount(sessions: Record<string, Session>, year: number): number {
  let count = 0;
  for (let m = 0; m < 12; m++) {
    count += getMonthSessionCount(sessions, year, m);
  }
  return count;
}

export function getMonthStreak(sessions: Record<string, Session>, year: number, month: number): number {
  const today = new Date();
  const daysInMonth = getDaysInMonth(year, month);
  let streak = 0;

  // Count backwards from today (or end of month if past)
  const lastDay = (year === today.getFullYear() && month === today.getMonth())
    ? today.getDate()
    : daysInMonth;

  for (let d = lastDay; d >= 1; d--) {
    if (sessions[formatDate(year, month, d)]) {
      streak++;
    } else if (d < lastDay) {
      break;
    }
    // If the last day itself has no session, streak stays 0
    if (d === lastDay && !sessions[formatDate(year, month, d)]) break;
  }
  return streak;
}
