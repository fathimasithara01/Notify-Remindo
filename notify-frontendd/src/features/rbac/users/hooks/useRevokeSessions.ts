import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';

export function useRevokeSessions() {
  return useMutation({
    mutationFn: (id: string) => usersApi.revokeSessions(id),
    onSuccess: () => {
      toast.success('All sessions revoked. The user will be signed out everywhere.');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to revoke sessions';
      toast.error(message);
    },
  });
}