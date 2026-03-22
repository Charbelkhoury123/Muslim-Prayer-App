import type { DailyPrayerLog, ObligatoryPrayerId } from '../types/prayer';
import { formatLocalDateKey, startOfLocalDay } from '../utils/date';
import { prayerStorage } from './mmkv';

const LOG_PREFIX = 'praylog:';

function emptyLog(): DailyPrayerLog {
  return {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  };
}

export function getDailyLog(date: Date = new Date()): DailyPrayerLog {
  const raw = prayerStorage.getString(LOG_PREFIX + formatLocalDateKey(date));
  if (!raw) return emptyLog();
  try {
    const parsed = JSON.parse(raw) as Partial<DailyPrayerLog>;
    return { ...emptyLog(), ...parsed };
  } catch {
    return emptyLog();
  }
}

export function setPrayerCompletion(
  prayer: ObligatoryPrayerId,
  completed: boolean,
  date: Date = new Date()
): void {
  const k = LOG_PREFIX + formatLocalDateKey(date);
  const log = getDailyLog(date);
  log[prayer] = completed;
  prayerStorage.set(k, JSON.stringify(log));
}

export function isDayFullyComplete(date: Date): boolean {
  const log = getDailyLog(date);
  return log.fajr && log.dhuhr && log.asr && log.maghrib && log.isha;
}

/**
 * Consecutive local days (ending at the most recent applicable day) where all five obligatory prayers are marked complete.
 * If today is not yet complete, counting starts from yesterday.
 */
export function getCurrentStreak(now: Date = new Date()): number {
  let streak = 0;
  let d = startOfLocalDay(now);
  if (!isDayFullyComplete(d)) {
    d = new Date(d);
    d.setDate(d.getDate() - 1);
  }
  while (isDayFullyComplete(d)) {
    streak += 1;
    d = new Date(d);
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
