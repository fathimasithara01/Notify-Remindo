import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UserFilters } from '../types/user.types';
import { queryKeys } from '@/lib/query/query-keys';

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => usersApi.list(filters),
    placeholderData: (previousData) => previousData, // keep old page visible while next loads
  });
}