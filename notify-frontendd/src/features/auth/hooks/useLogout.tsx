'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth.api';
import { AUTH_QUERY_KEY } from './useCurrentUser';

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