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
  meta: PaginationMeta;
}


export function parsePaginationParams(
  query: { page?: string | number; limit?: string | number },
  options?: { defaultLimit?: number; maxLimit?: number }
): PaginationParams {
  const defaultLimit = options?.defaultLimit ?? 10;
  const maxLimit = options?.maxLimit ?? 100;

  const rawPage = Number(query.page);
  const rawLimit = Number(query.limit);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(Math.floor(rawLimit), maxLimit)
      : defaultLimit;

  return { page, limit };
}

export function paginationMeta(total: number, params: PaginationParams): PaginationMeta {
  const { page, limit } = params;
  const totalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;

  return { total, page, limit, totalPages };
}


export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return {
    items,
    meta: paginationMeta(total, params),
  };
}


export function getOffset(params: PaginationParams): number {
  return (params.page - 1) * params.limit;
}