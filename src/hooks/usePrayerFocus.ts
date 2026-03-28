import { useMemo } from 'react';
import { usePrayerTimes } from './usePrayerTimes';
import { useUserPreferences } from './useUserPreferences';
import { usePrayerLog } from './usePrayerLog';

const FOCUS_WINDOW_MS = 20 * 60 * 1000; // 20 minutes

export function usePrayerFocus() {
  const { calculationMethod, madhab } = useUserPreferences();
  const { prayerTimes } = usePrayerTimes({ calculationMethod, madhab });
  const { todayLog } = usePrayerLog();

  const activeFocus = useMemo(() => {
    if (!prayerTimes) return null;

    const now = new Date();
    const prayers = [
      { id: 'fajr', at: prayerTimes.fajr },
      { id: 'dhuhr', at: prayerTimes.dhuhr },
      { id: 'asr', at: prayerTimes.asr },
      { id: 'maghrib', at: prayerTimes.maghrib },
      { id: 'isha', at: prayerTimes.isha },
    ];

    for (const prayer of prayers) {
      const diff = now.getTime() - prayer.at.getTime();
      // If we are within the window AND the prayer hasn't been logged yet
      if (diff >= 0 && diff < FOCUS_WINDOW_MS && !todayLog[prayer.id as any]) {
        return {
          id: prayer.id,
          msRemaining: FOCUS_WINDOW_MS - diff,
          label: prayer.id.charAt(0).toUpperCase() + prayer.id.slice(1),
        };
      }
    }

    return null;
  }, [prayerTimes, todayLog]);

  return activeFocus;
}
