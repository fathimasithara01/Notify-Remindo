'use client';

import { useState } from 'react';
import { Check, Copy, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface InviteSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteUrl: string;
  userName: string;
  emailSent: boolean;
}

export function InviteSuccessDialog({
  open,
  onOpenChange,
  inviteUrl,
  userName,
  emailSent,
}: InviteSuccessDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access failed silently — user can still select and copy manually
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {emailSent ? `Invite sent to ${userName}` : `Invite created for ${userName}`}
          </DialogTitle>
          <DialogDescription>
            {emailSent
              ? "An email has been sent with this link. If it doesn't arrive, you can copy and share it manually. This link expires in 7 days."
              : 'This link expires in 7 days.'}
          </DialogDescription>
        </DialogHeader>

        {!emailSent && (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              We couldn&apos;t send the invite email right now. Copy the link
              below and share it with {userName} directly.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Input value={inviteUrl} readOnly className="flex-1 text-sm" />
          <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}