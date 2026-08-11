import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { AuthUser } from '@/features/auth/types/auth.types';
import { queryKeys } from '@/lib/query/query-keys';

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => apiClient.get<AuthUser>('/auth/me'),
    staleTime: 5 * 60_000,
    retry: false,
  });
}