export const OBLIGATORY_PRAYER_IDS = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
] as const;

export type ObligatoryPrayerId = (typeof OBLIGATORY_PRAYER_IDS)[number];

export type DailyPrayerLog = Record<ObligatoryPrayerId, boolean>;
