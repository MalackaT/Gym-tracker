import { useState, useCallback, useEffect } from 'react';
import type { GymData, Session, WorkoutType } from '../utils/dateHelpers';
import { YEAR, calculateBestStreak } from '../utils/dateHelpers';

const STORAGE_KEY = `gymtracker_${YEAR}`;

function loadData(): GymData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { sessions: {}, weeklyGoal: 3, bestStreak: 0 };
}

function saveData(data: GymData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useGymData() {
  const [data, setData] = useState<GymData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addSession = useCallback((date: string, type: WorkoutType, note: string) => {
    setData(prev => {
      const sessions = { ...prev.sessions, [date]: { type, note } };
      const best = Math.max(prev.bestStreak, calculateBestStreak(sessions, YEAR));
      return { ...prev, sessions, bestStreak: best };
    });
  }, []);

  const removeSession = useCallback((date: string) => {
    setData(prev => {
      const sessions = { ...prev.sessions };
      delete sessions[date];
      const best = calculateBestStreak(sessions, YEAR);
      return { ...prev, sessions, bestStreak: best };
    });
  }, []);

  const updateNote = useCallback((date: string, note: string) => {
    setData(prev => {
      const existing = prev.sessions[date];
      if (!existing) return prev;
      return {
        ...prev,
        sessions: { ...prev.sessions, [date]: { ...existing, note } },
      };
    });
  }, []);

  const setWeeklyGoal = useCallback((goal: number) => {
    setData(prev => ({ ...prev, weeklyGoal: Math.max(1, Math.min(7, goal)) }));
  }, []);

  return { data, addSession, removeSession, updateNote, setWeeklyGoal };
}
