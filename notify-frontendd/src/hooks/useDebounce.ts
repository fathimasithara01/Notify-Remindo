'use client';

import { useEffect, useState } from 'react';
import { DEBOUNCE_DELAY_MS } from '@/features/audit-log/constants/app';

export function useDebounce<T>(value: T, delayMs: number = DEBOUNCE_DELAY_MS): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}