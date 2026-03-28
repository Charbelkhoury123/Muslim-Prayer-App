class WebMMKV {
  set(key: string, value: string | number | boolean) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, String(value));
    }
  }
  getString(key: string) {
    const v = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return v !== null ? v : undefined;
  }
  getNumber(key: string) {
    const v = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return v ? Number(v) : undefined;
  }
  getBoolean(key: string) {
    const v = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return v === 'true' ? true : v === 'false' ? false : undefined;
  }
  delete(key: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
  addOnValueChangedListener(callback: (key: string) => void) {
    return {
      remove: () => {},
    };
  }
}

export const prayerStorage = new WebMMKV() as any;
