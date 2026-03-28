import * as SQLite from 'expo-sqlite';

/**
 * Detailed Journal Entry for missed prayers
 */
export interface JournalEntry {
  id?: number;
  prayer_id: string; // e.g. 'fajr'
  date: string;      // YYYY-MM-DD
  reflection: string;
  timestamp: number;
}

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database and create tables if they don't exist
 */
export async function initDB() {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync('aqimo.db');
  
  // Create Journal Table
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS journal (
      id INTEGER PRIMARY KEY NOT NULL,
      prayer_id TEXT NOT NULL,
      date TEXT NOT NULL,
      reflection TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );
  `);
  
  return db;
}

/**
 * Save a new journal entry
 */
export async function saveJournalEntry(entry: Omit<JournalEntry, 'id'>) {
  const database = await initDB();
  await database.runAsync(
    'INSERT INTO journal (prayer_id, date, reflection, timestamp) VALUES (?, ?, ?, ?)',
    entry.prayer_id,
    entry.date,
    entry.reflection,
    entry.timestamp
  );
}

/**
 * Fetch all entries for a specific prayer/date or all
 */
export async function getJournalEntries(): Promise<JournalEntry[]> {
  const database = await initDB();
  return await database.getAllAsync<JournalEntry>('SELECT * FROM journal ORDER BY timestamp DESC');
}

/**
 * Get count of entries for stats
 */
export async function getJournalCount(): Promise<number> {
  const database = await initDB();
  const result = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM journal');
  return result?.count ?? 0;
}
