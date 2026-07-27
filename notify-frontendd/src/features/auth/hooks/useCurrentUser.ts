'use client';

import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import {queryKeys} from '@/lib/query/query-keys'


export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.me,
    retry: false, // a 401 here means "not logged in", not "network blip" — don't retry
  });
}