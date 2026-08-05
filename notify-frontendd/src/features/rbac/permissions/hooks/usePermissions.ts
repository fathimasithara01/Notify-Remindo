import { useQuery } from '@tanstack/react-query';
import { permissionsApi } from '../api/permissions.api';
import type { PermissionFilters } from '../types/permission.types';
import { queryKeys } from '@/lib/query/query-keys';

export function usePermissions(filters: PermissionFilters) {
  return useQuery({
    queryKey: queryKeys.permissions.list(filters),
    queryFn: () => permissionsApi.list(filters),
    placeholderData: (previousData) => previousData,
  });
}