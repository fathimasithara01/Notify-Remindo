import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UserFilters } from '../types/user.types';
import { queryKeys } from '@/lib/query/query-keys';

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: async () => {
      const result = await usersApi.list(filters);
      return {
        items: Array.isArray(result) ? result : result.items,
        meta: (result as any).meta,
      };
    },
    placeholderData: (previousData) => previousData,
  });
}