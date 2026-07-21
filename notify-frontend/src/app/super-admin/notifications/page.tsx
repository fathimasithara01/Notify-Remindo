'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationApi } from '@/lib/api/notifications';
import { ApiClientError } from '@/lib/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '@/components/ui/table';
import {Select,SelectContent,SelectItem,SelectTrigger, SelectValue} from '@/components/ui/select';
import { Loader2, Send, X } from 'lucide-react';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { NotificationStatus } from '@/lib/types/notification';

const STATUS_VARIANT: Record<NotificationStatus, 'default' | 'secondary' | 'destructive'> = {
  pending: 'secondary',
  sent: 'default',
  failed: 'destructive',
};

export default function NotificationsPage() {
  const [statusFilter, setStatusFilter] = useState<NotificationStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', statusFilter, page],
    queryFn: () =>
      notificationApi.list({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        limit: 20,
      }),
  });
  const notifications = data?.items;

  const sendNowMutation = useMutation({
    mutationFn: notificationApi.sendNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification sent');
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });

  const cancelMutation = useMutation({
    mutationFn: notificationApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification cancelled');
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Scheduled reminders across all organizations.
          </p>
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No notifications found.
                  </TableCell>
                </TableRow>
              )}
              {notifications?.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-mono text-sm">{n.referenceType}</TableCell>
                  <TableCell className="capitalize">{n.mode.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[n.status]}>{n.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(n.scheduledAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {n.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendNowMutation.mutate(n.id)}
                          disabled={sendNowMutation.isPending}
                        >
                          <Send className="mr-1 h-3.5 w-3.5" />
                          Send now
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => cancelMutation.mutate(n.id)}
                          disabled={cancelMutation.isPending}
                        >
                          <X className="mr-1 h-3.5 w-3.5" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </div>
      )}
    </div>
  );
}