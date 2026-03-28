import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getPrayerTimesForDate } from '../utils/prayerEngine';

export function usePrayerState(date: Date = new Date()) {
  const { coordinates, calculationMethod, madhab } = useAppStore();

  const prayerTimes = useMemo(() => {
    if (!coordinates) return null;
    return getPrayerTimesForDate(date, coordinates, calculationMethod, madhab);
  }, [date, coordinates, calculationMethod, madhab]);

  return {
    prayerTimes,
    isLoading: !coordinates,
  };
}
