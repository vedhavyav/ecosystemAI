import { FootprintResult } from "./calculations";

export type TrackingEntry = {
  id: string;
  timestamp: number;
  dateString: string;
  result: FootprintResult;
};

const STORAGE_KEY = 'ecosystem_ai_tracking_history';

export function saveFootprintEntry(result: FootprintResult): TrackingEntry {
  const history = getFootprintHistory();
  
  const newEntry: TrackingEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    dateString: new Date().toISOString(),
    result
  };

  history.push(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  
  return newEntry;
}

export function getFootprintHistory(): TrackingEntry[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data) as TrackingEntry[];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
