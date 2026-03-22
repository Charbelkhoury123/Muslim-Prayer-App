import { Prayer, PrayerTimes, type CalculationParameters } from 'adhan';

export type NextPrayerInfo = {
  id: string;
  at: Date;
};

/**
 * Next prayer after `now` for today's timetable. After Isha, returns tomorrow's Fajr.
 */
export function getNextPrayer(
  pt: PrayerTimes,
  now: Date,
  params: CalculationParameters
): NextPrayerInfo {
  const next = pt.nextPrayer(now);
  if (next !== Prayer.None) {
    const at = pt.timeForPrayer(next);
    if (at) return { id: next, at };
  }
  const tomorrow = new Date(pt.date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextPt = new PrayerTimes(pt.coordinates, tomorrow, params);
  return { id: Prayer.Fajr, at: nextPt.fajr };
}
