import { useQuery } from '@tanstack/react-query';
import { rolesApi } from '../api/roles.api';
import { queryKeys } from '@/lib/query/query-keys';

export function useRole(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.roles.detail(id ?? ''),
    queryFn: () => rolesApi.getOne(id as string),
    enabled: Boolean(id),
  });
}