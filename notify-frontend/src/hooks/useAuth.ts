'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/client';
import { LoginPayload } from '@/lib/types/auth';

const AUTH_QUERY_KEY = ['auth', 'me'];

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.me,
    retry: false, // a 401 here means "not logged in", not "network blip" — don't retry
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      router.push('/super-admin/dashboard');
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      router.push('/login');
    },
  });
}