import { useState, useEffect } from 'react';
import { useGymData } from './hooks/useGymData';
import { YEAR, getYearSessionCount } from './utils/dateHelpers';
import StatsBar from './components/StatsBar';
import GoalTracker from './components/GoalTracker';
import YearView from './components/YearView';


function DarkModeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title="Toggle dark mode"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

export default function App() {
  const { data, addSession, removeSession, setWeeklyGoal } = useGymData();
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gymtracker_dark');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('gymtracker_dark', String(dark));
  }, [dark]);

  const totalSessions = getYearSessionCount(data.sessions, YEAR);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Gym Tracker
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{YEAR}</p>
          </div>
          <DarkModeToggle dark={dark} onToggle={() => setDark(d => !d)} />
        </div>

        {/* Stats */}
        <StatsBar data={data} />

        {/* Weekly Goal */}
        <GoalTracker data={data} onSetGoal={setWeeklyGoal} />

        {/* Empty state */}
        {totalSessions === 0 && (
          <div className="text-center py-8 mb-6">
            <p className="text-4xl mb-2">💪</p>
            <p className="text-gray-500 dark:text-gray-400">
              Log your first session!
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Click any month below, then click a day to get started.
            </p>
          </div>
        )}

        {/* Year View */}
        <YearView
          sessions={data.sessions}
          onAddSession={addSession}
          onRemoveSession={removeSession}
        />
      </div>
    </div>
  );
}
