import {
  CalculationMethod,
  Coordinates,
  Madhab,
  PrayerTimes,
} from 'adhan';
import type { CalculationParameters } from 'adhan';
import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { getNextPrayer } from '../utils/nextPrayer';
import { formatLocalDateKey, localDateFromDayKey } from '../utils/date';
import { useNow } from './useNow';

export type CoordinatesPayload = {
  latitude: number;
  longitude: number;
};

export type PrayerTimesResult = {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;
};

export type UsePrayerTimesOptions = {
  /** When true (default), requests foreground location and fills coordinates from GPS. */
  autoRequestLocation?: boolean;
  /** When set, skips GPS and uses these coordinates (e.g. manual city picker). */
  coordinatesOverride?: CoordinatesPayload | null;
  /** Preset from `adhan` (default: MuslimWorldLeague). */
  calculationMethod?: keyof typeof CalculationMethod;
  /** Asr shadow length (default: Shafi). */
  madhab?: (typeof Madhab)[keyof typeof Madhab];
  /** Fully custom parameters; overrides `calculationMethod` / `madhab` when provided. */
  calculationParameters?: CalculationParameters;
};

export function usePrayerTimes(options: UsePrayerTimesOptions = {}) {
  const {
    autoRequestLocation = true,
    coordinatesOverride = null,
    calculationMethod = 'MuslimWorldLeague',
    madhab = Madhab.Shafi,
    calculationParameters: paramsOverride,
  } = options;

  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);
  const [coords, setCoords] = useState<CoordinatesPayload | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(autoRequestLocation);
  const [locationError, setLocationError] = useState<Error | null>(null);
  const [calendarDayKey, setCalendarDayKey] = useState(() =>
    formatLocalDateKey(new Date())
  );

  const effectiveCoords = coordinatesOverride ?? coords;

  const calculationParams = useMemo(() => {
    if (paramsOverride) return paramsOverride;
    const p = CalculationMethod[calculationMethod]();
    p.madhab = madhab;
    return p;
  }, [paramsOverride, calculationMethod, madhab]);

  const prayerDate = useMemo(
    () => localDateFromDayKey(calendarDayKey),
    [calendarDayKey]
  );

  const prayerTimesInstance = useMemo((): PrayerTimes | null => {
    if (!effectiveCoords) return null;
    const c = new Coordinates(
      effectiveCoords.latitude,
      effectiveCoords.longitude
    );
    return new PrayerTimes(c, prayerDate, calculationParams);
  }, [effectiveCoords, prayerDate, calculationParams]);

  const prayerTimes = useMemo((): PrayerTimesResult | null => {
    if (!prayerTimesInstance) return null;
    const pt = prayerTimesInstance;
    return {
      fajr: pt.fajr,
      sunrise: pt.sunrise,
      dhuhr: pt.dhuhr,
      asr: pt.asr,
      sunset: pt.sunset,
      maghrib: pt.maghrib,
      isha: pt.isha,
    };
  }, [prayerTimesInstance]);

  const now = useNow(1000);

  const nextPrayer = useMemo(() => {
    if (!prayerTimesInstance) return null;
    return getNextPrayer(prayerTimesInstance, now, calculationParams);
  }, [prayerTimesInstance, now, calculationParams]);

  const msUntilNext = useMemo(() => {
    if (!nextPrayer) return null;
    return Math.max(0, nextPrayer.at.getTime() - now.getTime());
  }, [nextPrayer, now]);

  const refreshCalendarDay = useCallback(() => {
    setCalendarDayKey(formatLocalDateKey(new Date()));
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener(
      'change',
      (next: AppStateStatus) => {
        if (next === 'active') refreshCalendarDay();
      }
    );
    return () => sub.remove();
  }, [refreshCalendarDay]);

  useEffect(() => {
    const id = setInterval(() => {
      const next = formatLocalDateKey(new Date());
      setCalendarDayKey((k) => (next !== k ? next : k));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const requestPermissionAndLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(perm.status);
      if (perm.status !== 'granted') {
        setCoords(null);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    } catch (e) {
      setLocationError(e instanceof Error ? e : new Error(String(e)));
      setCoords(null);
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    if (coordinatesOverride != null) {
      setIsLoadingLocation(false);
      return;
    }
    if (!autoRequestLocation) {
      setIsLoadingLocation(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setIsLoadingLocation(true);
      setLocationError(null);
      try {
        const current = await Location.getForegroundPermissionsAsync();
        if (cancelled) return;
        setPermissionStatus(current.status);
        if (current.status !== 'granted') {
          const req = await Location.requestForegroundPermissionsAsync();
          if (cancelled) return;
          setPermissionStatus(req.status);
          if (req.status !== 'granted') {
            setCoords(null);
            return;
          }
        }
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } catch (e) {
        if (!cancelled) {
          setLocationError(e instanceof Error ? e : new Error(String(e)));
          setCoords(null);
        }
      } finally {
        if (!cancelled) setIsLoadingLocation(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [autoRequestLocation, coordinatesOverride]);

  return {
    coordinates: effectiveCoords,
    permissionStatus,
    requestPermissionAndLocation,
    isLoadingLocation,
    locationError,
    prayerTimes,
    prayerDate,
    calendarDayKey,
    refreshCalendarDay,
    nextPrayer,
    msUntilNext,
  };
}
