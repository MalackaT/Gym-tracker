import { useState } from 'react';
import type { Session, WorkoutType } from '../utils/dateHelpers';
import {
  YEAR, MONTHS,
  getDaysInMonth, getFirstDayOfWeek, formatDate,
  getMonthSessionCount,
} from '../utils/dateHelpers';
import MonthModal from './MonthModal';

interface Props {
  sessions: Record<string, Session>;
  onAddSession: (date: string, type: WorkoutType, note: string) => void;
  onRemoveSession: (date: string) => void;
}

function MiniMonthGrid({ month, sessions }: { month: number; sessions: Record<string, Session> }) {
  const daysInMonth = getDaysInMonth(YEAR, month);
  const firstDay = getFirstDayOfWeek(YEAR, month);
  const dots: ('session' | 'empty' | 'pad')[] = [];

  for (let i = 0; i < firstDay; i++) dots.push('pad');
  for (let d = 1; d <= daysInMonth; d++) {
    dots.push(sessions[formatDate(YEAR, month, d)] ? 'session' : 'empty');
  }

  return (
    <div className="grid grid-cols-7 gap-[3px] mt-2">
      {dots.map((type, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            type === 'session' ? 'bg-[#639922]' :
            type === 'empty' ? 'bg-gray-200 dark:bg-gray-600' :
            'bg-transparent'
          }`}
        />
      ))}
    </div>
  );
}

export default function YearView({ sessions, onAddSession, onRemoveSession }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {MONTHS.map((name, i) => {
          const count = getMonthSessionCount(sessions, YEAR, i);
          return (
            <button
              key={i}
              onClick={() => setSelectedMonth(i)}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-left hover:border-[#639922] hover:shadow-sm transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">{count} session{count !== 1 ? 's' : ''}</span>
              </div>
              <MiniMonthGrid month={i} sessions={sessions} />
            </button>
          );
        })}
      </div>

      {selectedMonth !== null && (
        <MonthModal
          month={selectedMonth}
          sessions={sessions}
          onClose={() => setSelectedMonth(null)}
          onAddSession={onAddSession}
          onRemoveSession={onRemoveSession}
        />
      )}
    </>
  );
}
