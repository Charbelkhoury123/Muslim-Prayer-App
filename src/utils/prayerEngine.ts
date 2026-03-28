import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';
import type { CalculationParameters } from 'adhan';
import { CalculationMethodKey, MadhabKey } from '../store/useAppStore';

export interface PrayerResult {
  id: string;
  name: string;
  at: Date;
  label: string;
}

export function getPrayerTimesForDate(
  date: Date,
  coords: { latitude: number; longitude: number }, 
  methodKey: CalculationMethodKey,
  madhab: MadhabKey
) {
  const coordinates = new Coordinates(coords.latitude, coords.longitude);
  const params = CalculationMethod[methodKey]();
  params.madhab = madhab;
  
  return new PrayerTimes(coordinates, date, params);
}

export function getNextPrayerBrief(
  times: PrayerTimes,
  now: Date
) {
  const next = times.nextPrayer(now);
  if (next === 'none') {
    // Tomorrow's Fajr
    return null;
  }
  
  const time = times.timeForPrayer(next);
  return {
    id: next,
    at: time,
  };
}
