import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CalculationMethod, Madhab, Coordinates } from 'adhan';
import * as Location from 'expo-location';

// Simple polyfill for storage since we removed MMKV for compatibility
const storage = {
  getItem: (name: string) => null,
  setItem: (name: string, value: string) => {},
  removeItem: (name: string) => {},
};

export type CalculationMethodKey = keyof typeof CalculationMethod;
export type MadhabKey = (typeof Madhab)[keyof typeof Madhab];

interface AppState {
  // Onboarding
  hasOnboarded: boolean;
  setOnboarded: (v: boolean) => void;

  // Location
  coordinates: { latitude: number; longitude: number } | null;
  locationName: string | null;
  setLocation: (coords: { latitude: number; longitude: number }, name?: string) => void;
  
  // Prayer Settings
  calculationMethod: CalculationMethodKey;
  madhab: MadhabKey;
  setCalculationMethod: (method: CalculationMethodKey) => void;
  setMadhab: (madhab: MadhabKey) => void;

  // Notifications
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;

  // App Blocking
  blockedAppIds: string[];
  setBlockedAppIds: (ids: string[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      setOnboarded: (v) => set({ hasOnboarded: v }),

      coordinates: null,
      locationName: null,
      setLocation: (coords, name) => set({ coordinates: coords, locationName: name ?? null }),

      calculationMethod: 'MuslimWorldLeague',
      madhab: Madhab.Shafi,
      setCalculationMethod: (method) => set({ calculationMethod: method }),
      setMadhab: (madhab) => set({ madhab: madhab }),

      notificationsEnabled: true,
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),

      blockedAppIds: [],
      setBlockedAppIds: (ids) => set({ blockedAppIds: ids }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
