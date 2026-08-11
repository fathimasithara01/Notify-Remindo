import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { queryKeys } from '@/lib/query/query-keys';

export function useRevokeSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.revokeSessions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}