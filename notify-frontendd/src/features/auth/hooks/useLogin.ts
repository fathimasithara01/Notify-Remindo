'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import {queryKeys} from '@/lib/query/query-keys'
import { ApiClientError } from '@/lib/api/errors';
import { LoginPayload } from '../types/auth.types';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload), //    mutationFn: (payload) => authApi.login(payload),

    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      router.push('/super-admin/dashboard');
    },
    onError: (error: ApiClientError) => {  //    onError: (error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}