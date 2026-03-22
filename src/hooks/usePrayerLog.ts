import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ObligatoryPrayerId } from '../types/prayer';
import {
  getCurrentStreak,
  getDailyLog,
  setPrayerCompletion,
} from '../storage/prayerLog';
import { prayerStorage } from '../storage/mmkv';

/**
 * Subscribes to MMKV updates for prayer completion logs and exposes streak + today's log.
 */
export function usePrayerLog() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const listener = prayerStorage.addOnValueChangedListener((key) => {
      if (key.startsWith('praylog:')) setVersion((v) => v + 1);
    });
    return () => listener.remove();
  }, []);

  const todayLog = useMemo(() => getDailyLog(new Date()), [version]);
  const streak = useMemo(() => getCurrentStreak(new Date()), [version]);

  const setCompleted = useCallback(
    (prayer: ObligatoryPrayerId, completed: boolean, date: Date = new Date()) => {
      setPrayerCompletion(prayer, completed, date);
    },
    []
  );

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  return {
    todayLog,
    streak,
    setCompleted,
    refresh,
  };
}
