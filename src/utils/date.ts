/** Local calendar day key (YYYY-MM-DD) for the device timezone. */
export function formatLocalDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parse a day key to a Date at local noon (avoids DST midnight edge cases). */
export function localDateFromDayKey(dayKey: string): Date {
  const [y, m, d] = dayKey.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function startOfLocalDay(d: Date = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
