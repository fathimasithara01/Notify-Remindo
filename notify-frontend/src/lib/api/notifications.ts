import { apiClient } from './client';
import { Notification, NotificationListFilter } from '../types/notification';

export const notificationApi = {
  list: (filter?: NotificationListFilter) =>
    apiClient.get<Notification[]>('/notifications', {
      organizationId: filter?.organizationId,
      status: filter?.status,
      mode: filter?.mode,
    }),

  sendNow: (id: string) => apiClient.post<null>(`/notifications/${id}/send-now`),

  cancel: (id: string) => apiClient.delete<null>(`/notifications/${id}`),
};