// src/shared/utils/pagination.ts

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export function parsePagination(
  query: Record<string, unknown>
): PaginationParams {
  const page = Math.max(
    DEFAULT_PAGE,
    Number(query.page) || DEFAULT_PAGE
  );

  const limit = Math.min(
    MAX_LIMIT,
    Math.max(
      1,
      Number(query.limit) || DEFAULT_LIMIT
    )
  );

  return {
    page,
    limit,
  };
}

export function getPaginationOffset({
  page,
  limit,
}: PaginationParams): number {
  return (page - 1) * limit;
}

export function buildPaginationMeta(
  total: number,
  { page, limit }: PaginationParams
): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}