export function toQueryParams(
  filters: object
): Record<string, string | number | boolean | undefined> {
  const params: Record<string, string | number | boolean | undefined> = {};

  for (const [key, value] of Object.entries(filters as Record<string, unknown>)) {
    if (value === undefined || value === 'all') continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      params[key] = value;
    }
  }

  return params;
}