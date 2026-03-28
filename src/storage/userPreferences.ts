import { CalculationMethod, Madhab } from 'adhan';
import { prayerStorage } from './mmkv';

const KEY_METHOD = 'prefs:calculationMethod';
const KEY_MADHAB = 'prefs:madhab';
const KEY_ONBOARDED = 'prefs:hasCompletedOnboarding';
const KEY_NOTIFICATIONS = 'prefs:notificationsEnabled';

export type CalculationMethodKey = keyof typeof CalculationMethod;
export type MadhabKey = (typeof Madhab)[keyof typeof Madhab];

export const CALCULATION_METHOD_KEYS = Object.keys(
  CalculationMethod
) as CalculationMethodKey[];

const DEFAULT_METHOD: CalculationMethodKey = 'MuslimWorldLeague';
const DEFAULT_MADHAB: MadhabKey = Madhab.Shafi;

function isCalculationMethodKey(s: string): s is CalculationMethodKey {
  return Object.prototype.hasOwnProperty.call(CalculationMethod, s);
}

function isMadhabKey(s: string): s is MadhabKey {
  return s === Madhab.Shafi || s === Madhab.Hanafi;
}

export function getCalculationMethodKey(): CalculationMethodKey {
  const v = prayerStorage.getString(KEY_METHOD);
  if (v && isCalculationMethodKey(v)) return v;
  return DEFAULT_METHOD;
}

export function setCalculationMethodKey(k: CalculationMethodKey): void {
  prayerStorage.set(KEY_METHOD, k);
}

export function getMadhabKey(): MadhabKey {
  const v = prayerStorage.getString(KEY_MADHAB);
  if (v && isMadhabKey(v)) return v;
  return DEFAULT_MADHAB;
}

export function setMadhabKey(k: MadhabKey): void {
  prayerStorage.set(KEY_MADHAB, k);
}

export function getHasCompletedOnboarding(): boolean {
  return prayerStorage.getBoolean(KEY_ONBOARDED) ?? false;
}

export function setHasCompletedOnboarding(v: boolean): void {
  prayerStorage.set(KEY_ONBOARDED, v);
}

export function getNotificationsEnabled(): boolean {
  return prayerStorage.getBoolean(KEY_NOTIFICATIONS) ?? true;
}

export function setNotificationsEnabled(v: boolean): void {
  prayerStorage.set(KEY_NOTIFICATIONS, v);
}

export const CALCULATION_METHOD_LABELS: Record<CalculationMethodKey, string> = {
  MuslimWorldLeague: 'Muslim World League',
  Egyptian: 'Egyptian General Authority',
  Karachi: 'University of Islamic Sciences, Karachi',
  UmmAlQura: 'Umm al-Qura, Makkah',
  Dubai: 'Dubai',
  MoonsightingCommittee: 'Moonsighting Committee',
  NorthAmerica: 'ISNA / North America',
  Kuwait: 'Kuwait',
  Qatar: 'Qatar',
  Singapore: 'Singapore',
  Tehran: 'Institute of Geophysics, Tehran',
  Turkey: 'Diyanet (Turkey)',
  Other: 'Custom (Other)',
};

export const MADHAB_LABELS: Record<MadhabKey, string> = {
  [Madhab.Shafi]: 'Shafi / Maliki / Hanbali (Asr shadow ×1)',
  [Madhab.Hanafi]: 'Hanafi (Asr shadow ×2)',
};
