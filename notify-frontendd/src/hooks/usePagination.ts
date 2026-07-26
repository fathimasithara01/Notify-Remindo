'use client';

import { useState, useCallback } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/constants/app';

export function usePagination(initialPage = 1, limit = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(initialPage);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const reset = useCallback(() => setPage(initialPage), [initialPage]);

  return { page, limit, setPage, nextPage, prevPage, reset };
}