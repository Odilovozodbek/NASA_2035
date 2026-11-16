// ============================================================================
// v2.0 — LOCALSTORAGE PERSISTENCE & GEMINI API KEY STORAGE
// ============================================================================

export interface PersistedProgress {
  lang?: 'uz' | 'en';
  soundEnabled?: boolean;
  ambientEnabled?: boolean;
  selectedRegion?: 'moon' | 'mars' | 'deepspace';
  selectedRelicId?: string;
  viewMode?: 'diagnostic' | 'map' | 'catalog';
  solvedQuizzes?: Record<string, boolean>;
  exploredIds?: Record<string, boolean>;
  chatHistory?: Record<string, Array<{ role: 'user' | 'model'; text: string }>>;
}

const STORAGE_KEY = 'echo-relic-2035:v2';
const GEMINI_KEY_STORAGE = 'echo-relic-2035:gemini-key';

export const Storage = {
  load(): PersistedProgress {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return {};
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) || {} : {};
    } catch {
      return {};
    }
  },
  save(data: PersistedProgress): boolean {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  },
  clear(): void {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage blocked */
    }
  },
  getGeminiKey(): string {
    try {
      const envKey = (import.meta as unknown as { env?: Record<string, string> })?.env?.VITE_GEMINI_API_KEY;
      return window.localStorage.getItem(GEMINI_KEY_STORAGE) || envKey || '';
    } catch {
      return '';
    }
  },
  setGeminiKey(k: string): void {
    try {
      const trimmed = k.trim();
      if (trimmed) window.localStorage.setItem(GEMINI_KEY_STORAGE, trimmed);
      else window.localStorage.removeItem(GEMINI_KEY_STORAGE);
    } catch {
      /* storage blocked */
    }
  }
};
