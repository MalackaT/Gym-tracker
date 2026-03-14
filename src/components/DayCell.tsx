import { useState } from 'react';
import type { CalendarDay, Session } from '../utils/dateHelpers';
import { todayStr } from '../utils/dateHelpers';

const TYPE_ICONS: Record<string, string> = {
  Cardio: '🏃',
  Strength: '🏋️',
  HIIT: '⚡',
  Yoga: '🧘',
  Swimming: '🏊',
  Cycling: '🚴',
  Other: '💪',
};

interface Props {
  calDay: CalendarDay;
  session?: Session;
  onClick: (e: React.MouseEvent) => void;
  onRemove: () => void;
}

export default function DayCell({ calDay, session, onClick, onRemove }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isToday = calDay.date === todayStr();
  const hasSession = !!session;

  if (!calDay.isCurrentMonth) {
    return (
      <div className="w-10 h-10 flex items-center justify-center text-xs text-gray-300 dark:text-gray-600">
        {calDay.day}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={hasSession ? onRemove : onClick}
        onMouseEnter={() => hasSession && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-150 relative
          ${hasSession
            ? 'bg-[#639922] text-white hover:bg-[#3B6D11]'
            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#EAF3DE] dark:hover:bg-gray-600'
          }
          ${isToday && !hasSession ? 'ring-2 ring-[#639922]' : ''}
          ${isToday && hasSession ? 'ring-2 ring-[#3B6D11] ring-offset-1 ring-offset-white dark:ring-offset-gray-900' : ''}
        `}
      >
        {calDay.day}
        {session?.note && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full" />
        )}
      </button>

      {showTooltip && session && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-30 shadow-lg">
          <span>{TYPE_ICONS[session.type] || ''} {session.type}</span>
          {session.note && <p className="text-gray-300 mt-0.5">{session.note}</p>}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
}
