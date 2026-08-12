import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';
import type { CreateUserDto, CreateUserResponse } from '../types/user.types';
import { queryKeys } from '@/lib/query/query-keys';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserDto): Promise<CreateUserResponse> => usersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
            toast.success('User created');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to create user';
      toast.error(message);
    },
  });
}