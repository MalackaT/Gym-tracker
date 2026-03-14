import { useState } from 'react';
import type { WorkoutType } from '../utils/dateHelpers';
import { WORKOUT_TYPES } from '../utils/dateHelpers';

interface Props {
  position: { top: number; left: number };
  onSelect: (type: WorkoutType, note: string) => void;
  onClose: () => void;
}

const TYPE_ICONS: Record<WorkoutType, string> = {
  Cardio: '🏃',
  Strength: '🏋️',
  HIIT: '⚡',
  Yoga: '🧘',
  Swimming: '🏊',
  Cycling: '🚴',
  Other: '💪',
};

export default function WorkoutPicker({ position, onSelect, onClose }: Props) {
  const [selectedType, setSelectedType] = useState<WorkoutType | null>(null);
  const [note, setNote] = useState('');

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-3 w-56 animate-in"
        style={{
          top: Math.min(position.top, window.innerHeight - 320),
          left: Math.min(position.left, window.innerWidth - 240),
        }}
      >
        {!selectedType ? (
          <>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Select workout</p>
            <div className="grid grid-cols-2 gap-1.5">
              {WORKOUT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[#EAF3DE] dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors text-left"
                >
                  <span>{TYPE_ICONS[type]}</span>
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              {TYPE_ICONS[selectedType]} {selectedType} — Add a note?
            </p>
            <input
              type="text"
              placeholder="e.g. leg day, personal best..."
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onSelect(selectedType, note); }}
              autoFocus
              className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mb-2 outline-none focus:border-[#639922]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => onSelect(selectedType, note)}
                className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-[#639922] text-white hover:bg-[#3B6D11] transition-colors"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
