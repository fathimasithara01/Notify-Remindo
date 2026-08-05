import { useQuery } from '@tanstack/react-query';
import { permissionsApi } from '../api/permissions.api';
import { queryKeys } from '@/lib/query/query-keys';

export function usePermission(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.permissions.detail(id ?? ''),
    queryFn: () => permissionsApi.getOne(id as string),
    enabled: Boolean(id),
  });
}