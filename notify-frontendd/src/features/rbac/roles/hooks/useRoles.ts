import { useQuery } from '@tanstack/react-query';
import { rolesApi } from '../api/roles.api';
import type { RoleFilters } from '../types/role.types';
import { queryKeys } from '@/lib/query/query-keys';

export function useRoles(filters: RoleFilters) {
  return useQuery({
    queryKey: queryKeys.roles.list(filters),
    queryFn: () => rolesApi.list(filters),
    placeholderData: (previousData) => previousData,
  });
}