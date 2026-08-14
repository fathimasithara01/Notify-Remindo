'use client';

import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface InviteSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
}

export function InviteSuccessDialog({ open, onOpenChange, userName }: InviteSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Password reset
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          The password for <strong>{userName}</strong> has been updated successfully.
        </p>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}