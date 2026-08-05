import { QueryClient } from '@tanstack/react-query';
import { ApiClientError } from '@/lib/api/errors';

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiClientError && error.status === 401) {
    return false;
  }

  return failureCount < 1;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetry,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        networkMode: 'online',
      },
      mutations: {
        retry: false,
        networkMode: 'online',
      },
    },
  });
}