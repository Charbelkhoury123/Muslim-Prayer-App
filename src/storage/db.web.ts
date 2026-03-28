const JOURNAL_KEY = 'aqimo:journal';

export interface JournalEntry {
  id?: number;
  prayer_id: string;
  date: string;
  reflection: string;
  timestamp: number;
}

function loadEntries(): JournalEntry[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(JOURNAL_KEY) : null;
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  }
}

export async function initDB() {
  return null;
}

export async function saveJournalEntry(entry: Omit<JournalEntry, 'id'>) {
  const entries = loadEntries();
  const id = Date.now();
  entries.unshift({ ...entry, id });
  saveEntries(entries);
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  return loadEntries().sort((a, b) => b.timestamp - a.timestamp);
}

export async function getJournalCount(): Promise<number> {
  return loadEntries().length;
}
