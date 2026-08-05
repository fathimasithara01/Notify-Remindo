import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { AuthUser } from '@/features/auth/types/auth.types';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'] as const,
    queryFn: () => apiClient.get<AuthUser>('/auth/me'),
    staleTime: 5 * 60_000,
    retry: false,
  });
}