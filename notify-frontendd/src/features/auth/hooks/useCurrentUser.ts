'use client';

import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';

export const AUTH_QUERY_KEY = ['auth', 'me'];

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.me,
    retry: false, // a 401 here means "not logged in", not "network blip" — don't retry
  });
}