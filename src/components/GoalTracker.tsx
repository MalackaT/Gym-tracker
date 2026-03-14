import type { GymData } from '../utils/dateHelpers';
import { getWeekSessionCount } from '../utils/dateHelpers';

interface Props {
  data: GymData;
  onSetGoal: (goal: number) => void;
}

export default function GoalTracker({ data, onSetGoal }: Props) {
  const weekSessions = getWeekSessionCount(data.sessions);
  const goal = data.weeklyGoal;
  const progress = Math.min(weekSessions / goal, 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Goal</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetGoal(goal - 1)}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-bold"
          >
            −
          </button>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 w-16 text-center">
            {goal}x / week
          </span>
          <button
            onClick={() => onSetGoal(goal + 1)}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-[#639922] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        {weekSessions}/{goal} this week
        {weekSessions >= goal && ' — Goal reached!'}
      </p>
    </div>
  );
}
