import { useState } from 'react';
import type { Session, WorkoutType } from '../utils/dateHelpers';
import {
  YEAR, MONTHS, DAYS_OF_WEEK,
  getMonthCalendar, getMonthSessionCount, getMonthStreak,
} from '../utils/dateHelpers';
import DayCell from './DayCell';
import WorkoutPicker from './WorkoutPicker';

interface Props {
  month: number;
  sessions: Record<string, Session>;
  onClose: () => void;
  onAddSession: (date: string, type: WorkoutType, note: string) => void;
  onRemoveSession: (date: string) => void;
}

export default function MonthModal({ month, sessions, onClose, onAddSession, onRemoveSession }: Props) {
  const [pickerState, setPickerState] = useState<{ date: string; pos: { top: number; left: number } } | null>(null);
  const weeks = getMonthCalendar(YEAR, month);
  const monthSessions = getMonthSessionCount(sessions, YEAR, month);
  const streak = getMonthStreak(sessions, YEAR, month);

  const handleDayClick = (date: string, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPickerState({ date, pos: { top: rect.bottom + 4, left: rect.left } });
  };

  const handleRemove = (date: string) => {
    if (confirm('Remove this session?')) {
      onRemoveSession(date);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md p-6 animate-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {MONTHS[month]} {YEAR}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="w-10 h-6 flex items-center justify-center text-xs font-medium text-gray-400 dark:text-gray-500">
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
            {week.map(calDay => (
              <DayCell
                key={calDay.date}
                calDay={calDay}
                session={sessions[calDay.date]}
                onClick={(e) => handleDayClick(calDay.date, e)}
                onRemove={() => handleRemove(calDay.date)}
              />
            ))}
          </div>
        ))}

        {/* Footer */}
        <div className="flex justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {monthSessions} session{monthSessions !== 1 ? 's' : ''}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Streak: {streak} day{streak !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {pickerState && (
        <WorkoutPicker
          position={pickerState.pos}
          onSelect={(type, note) => {
            onAddSession(pickerState.date, type, note);
            setPickerState(null);
          }}
          onClose={() => setPickerState(null)}
        />
      )}
    </div>
  );
}
