'use client';

import { useState } from 'react';
import { Check, Copy, TriangleAlert, ShieldAlert } from 'lucide-react';
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

type LinkKind = 'invite' | 'resend' | 'reset';
type Kind = LinkKind | 'temp-password';

interface InviteSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The link (invite/resend/reset kinds) or the plaintext temp password
   * (temp-password kind). Always shown in a read-only, copyable field. */
  value: string;
  userName: string;
  /** Ignored for kind="temp-password" — no email is ever sent on that path. */
  emailSent?: boolean;
  kind?: Kind;
}

const LINK_COPY: Record<LinkKind, { sentTitle: string; createdTitle: string; sentDescription: string; expiryNote: string }> = {
  invite: {
    sentTitle: 'Invite sent to',
    createdTitle: 'Invite created for',
    sentDescription: "An email has been sent with this link. If it doesn't arrive, you can copy and share it manually.",
    expiryNote: 'This link expires in 7 days.',
  },
  resend: {
    sentTitle: 'Invite resent to',
    createdTitle: 'New invite link created for',
    sentDescription: "A new email has been sent with this link. The old link no longer works. If the email doesn't arrive, you can copy and share this link manually.",
    expiryNote: 'This link expires in 7 days.',
  },
  reset: {
    sentTitle: 'Reset link sent to',
    createdTitle: 'Reset link created for',
    sentDescription: "An email has been sent with a link to set a new password. If it doesn't arrive, you can copy and share it manually.",
    expiryNote: 'This link expires in 24 hours.',
  },
};

export function InviteSuccessDialog({
  open,
  onOpenChange,
  value,
  userName,
  emailSent = true,
  kind = 'invite',
}: InviteSuccessDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access failed silently — user can still select and copy manually
    }
  };

  const isTempPassword = kind === 'temp-password';
  const linkCopy = isTempPassword ? null : LINK_COPY[kind];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isTempPassword
              ? `Temporary password for ${userName}`
              : emailSent
                ? `${linkCopy!.sentTitle} ${userName}`
                : `${linkCopy!.createdTitle} ${userName}`}
          </DialogTitle>
          <DialogDescription>
            {isTempPassword
              ? "Share this with them directly — it won't be shown again. They'll be required to set a new password on first login."
              : emailSent
                ? `${linkCopy!.sentDescription} ${linkCopy!.expiryNote}`
                : linkCopy!.expiryNote}
          </DialogDescription>
        </DialogHeader>

        {isTempPassword && (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              This password is shown only once and isn&apos;t stored anywhere
              you can retrieve later. If it&apos;s lost, use &quot;Reset
              password&quot; instead of asking for it again.
            </p>
          </div>
        )}

        {!isTempPassword && !emailSent && (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              We couldn&apos;t send the {kind === 'reset' ? 'reset' : 'invite'} email
              right now. Copy the link below and share it with {userName} directly.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Input
            value={value}
            readOnly
            className="flex-1 font-mono text-sm"
          />
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