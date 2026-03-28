// Memory-based safe storage fallback since we removed MMKV for compatibility
// This ensures Expo Go can run the app without JSI-related native crashes.
const memoryStorage = new Map<string, any>();
const listeners = new Set<(key: string) => void>();

export const prayerStorage = {
  set: (key: string, value: any) => {
    memoryStorage.set(key, value);
    listeners.forEach(l => l(key));
  },
  getString: (key: string): string | undefined => memoryStorage.get(key),
  getBoolean: (key: string): boolean | undefined => memoryStorage.get(key),
  getNumber: (key: string): number | undefined => memoryStorage.get(key),
  delete: (key: string) => {
    memoryStorage.delete(key);
    listeners.forEach(l => l(key));
  },
  clearAll: () => {
    memoryStorage.clear();
    listeners.forEach(l => l('__all__'));
  },
  getAllKeys: () => Array.from(memoryStorage.keys()),
  contains: (key: string) => memoryStorage.has(key),
  
  // MMKV specifics for hooks
  addOnValueChangedListener: (cb: (key: string) => void) => {
    listeners.add(cb);
    return { remove: () => listeners.delete(cb) };
  }
};
