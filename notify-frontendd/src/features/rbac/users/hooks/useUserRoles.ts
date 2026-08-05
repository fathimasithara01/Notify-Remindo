import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { queryKeys } from '@/lib/query/query-keys';

export function useUserRoles(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.roles(userId ?? ''),
    queryFn: () => usersApi.getRoles(userId as string),
    enabled: Boolean(userId),
  });
}