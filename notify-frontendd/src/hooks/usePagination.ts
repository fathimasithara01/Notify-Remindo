import { PaginatedResult } from '@/types/pagination';

interface PaginationInfo<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  limit: number;
}

export function usePaginationInfo<T>(
  data?: PaginatedResult<T>
): PaginationInfo<T> {
  return {
    items: data?.items ?? [],
    totalPages: data
      ? Math.max(1, Math.ceil(data.meta.total / data.meta.limit))
      : 1,
    currentPage: data?.meta.page ?? 1,
    totalItems: data?.meta.total ?? 0,
    limit: data?.meta.limit ?? 10,
  };
}