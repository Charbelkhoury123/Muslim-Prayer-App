import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type CalculationMethodKey,
  getCalculationMethodKey,
  getMadhabKey,
  setCalculationMethodKey,
  setMadhabKey,
  type MadhabKey,
} from '../storage/userPreferences';
import { prayerStorage } from '../storage/mmkv';

export function useUserPreferences() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const listener = prayerStorage.addOnValueChangedListener((key) => {
      if (key.startsWith('prefs:')) setVersion((v) => v + 1);
    });
    return () => listener.remove();
  }, []);

  const calculationMethod = useMemo(
    () => getCalculationMethodKey(),
    [version]
  );
  const madhab = useMemo(() => getMadhabKey(), [version]);

  const setCalculationMethod = useCallback((k: CalculationMethodKey) => {
    setCalculationMethodKey(k);
  }, []);

  const setMadhab = useCallback((k: MadhabKey) => {
    setMadhabKey(k);
  }, []);

  return {
    calculationMethod,
    madhab,
    setCalculationMethod,
    setMadhab,
  };
}
