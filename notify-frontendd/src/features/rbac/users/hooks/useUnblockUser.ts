import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';
import { queryKeys } from '@/lib/query/query-keys';

export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.unblock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      toast.success('User unblocked');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to unblock user');
    },
  });
}