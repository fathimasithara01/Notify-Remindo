import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { queryKeys } from '@/lib/query/query-keys';

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: () => usersApi.getOne(id as string),
    enabled: Boolean(id),
  });
}