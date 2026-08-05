'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRevokeSessions } from '../hooks/useRevokeSessions';
import type { User } from '../types/user.types';

interface RevokeSessionDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RevokeSessionDialog({ user, open, onOpenChange }: RevokeSessionDialogProps) {
  const revokeSessions = useRevokeSessions();

  const handleConfirm = () => {
    if (!user) return;
    revokeSessions.mutate(user.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke all sessions?</AlertDialogTitle>
          <AlertDialogDescription>
            {user?.name} will be signed out on every device immediately and
            will need to log in again. This does not change their access —
            just ends active sessions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={revokeSessions.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={revokeSessions.isPending}
          >
            {revokeSessions.isPending ? 'Revoking...' : 'Revoke sessions'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}