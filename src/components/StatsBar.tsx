import type { GymData } from '../utils/dateHelpers';
import {
  YEAR,
  getYearSessionCount,
  getMonthSessionCount,
  calculateCurrentStreak,
} from '../utils/dateHelpers';

interface Props {
  data: GymData;
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center">
      <span className="text-3xl font-bold text-[#639922]">{value}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</span>
    </div>
  );
}

export default function StatsBar({ data }: Props) {
  const today = new Date();
  const yearSessions = getYearSessionCount(data.sessions, YEAR);
  const monthSessions = getMonthSessionCount(data.sessions, YEAR, today.getMonth());
  const currentStreak = calculateCurrentStreak(data.sessions);
  const bestStreak = data.bestStreak;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatCard label="Sessions This Year" value={yearSessions} />
      <StatCard label="Sessions This Month" value={monthSessions} />
      <StatCard label="Current Streak" value={`${currentStreak}d`} />
      <StatCard label="Best Streak" value={`${bestStreak}d`} />
    </div>
  );
}
