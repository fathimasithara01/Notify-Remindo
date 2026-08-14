import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { ResetPlatfromUserPassword } from '../types/user.types';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query/query-keys';

export function useRequestPasswordReset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: ResetPlatfromUserPassword;
    }) => usersApi.requestPasswordReset(userId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.userId),
      });

      toast.success(
        'Platform admin password updated successfully',
      );
    },
  });
}