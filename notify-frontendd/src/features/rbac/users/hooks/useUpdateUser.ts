import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';
import type { UpdateUserDto } from '../types/user.types';
import { queryKeys } from '@/lib/query/query-keys';

interface UpdateUserArgs {
  id: string;
  payload: UpdateUserDto;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateUserArgs) => usersApi.update(id, payload),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.setQueryData(
        queryKeys.users.detail(updatedUser.id),
        updatedUser
      );
      toast.success('User updated successfully');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to update user';
      toast.error(message);
    },
  });
}