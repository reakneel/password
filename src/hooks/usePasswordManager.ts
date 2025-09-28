import { useState, useEffect } from 'react';
import { PasswordEntry } from '../types';
import { saveEntries, loadEntries } from '../utils/storage';

export function usePasswordManager() {
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedEntries = loadEntries();
    setEntries(loadedEntries);
    setLoading(false);
  }, []);

  const addEntry = (entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: PasswordEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<PasswordEntry>) => {
    const updatedEntries = entries.map(entry =>
      entry.id === id
        ? { ...entry, ...updates, updatedAt: new Date() }
        : entry
    );
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
  };

  const clearAllEntries = () => {
    setEntries([]);
    saveEntries([]);
  };

  const importEntries = (newEntries: PasswordEntry[]) => {
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    clearAllEntries,
    importEntries
  };
}