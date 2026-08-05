import { useQuery } from '@tanstack/react-query';
import { rolesApi } from '../api/roles.api';
import { queryKeys } from '@/lib/query/query-keys';

export function useRolePermissions(roleId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.roles.permissions(roleId ?? ''),
    queryFn: () => rolesApi.getPermissions(roleId as string),
    enabled: Boolean(roleId),
  });
}