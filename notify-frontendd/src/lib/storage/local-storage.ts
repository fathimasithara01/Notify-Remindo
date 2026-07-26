/**
 * SSR-safe wrapper — Next.js renders on the server first, where `window`
 * doesn't exist, so every method guards for that before touching localStorage.
 */
export const localStorage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or disabled — fail silently, this is for non-critical UI state only.
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};