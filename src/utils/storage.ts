import { PasswordEntry } from '../types';

const STORAGE_KEY = 'password_manager_entries';

// Simple encryption-like obfuscation (not cryptographically secure, but better than plain text)
function encode(data: string): string {
  return btoa(encodeURIComponent(data));
}

function decode(data: string): string {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data; // Fallback for unencoded data
  }
}

export function saveEntries(entries: PasswordEntry[]): void {
  const encoded = encode(JSON.stringify(entries));
  localStorage.setItem(STORAGE_KEY, encoded);
}

export function loadEntries(): PasswordEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const decoded = decode(stored);
    const entries = JSON.parse(decoded);
    return entries.map((entry: any) => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt)
    }));
  } catch {
    return [];
  }
}

export function exportData(): string {
  const entries = loadEntries();
  return JSON.stringify(entries, null, 2);
}

export function importData(data: string): PasswordEntry[] {
  try {
    const entries = JSON.parse(data);
    return entries.map((entry: any) => ({
      ...entry,
      id: entry.id || crypto.randomUUID(),
      createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
      updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : new Date()
    }));
  } catch {
    throw new Error('Invalid data format');
  }
}