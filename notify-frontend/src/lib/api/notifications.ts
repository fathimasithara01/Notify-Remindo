import { apiClient } from './client';
import { Notification, NotificationListFilter } from '../types/notification';
import { PaginatedResponse } from '../types/pagination';

export const notificationApi = {
  list: (filter?: NotificationListFilter & { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Notification>>('/notifications', {
      organizationId: filter?.organizationId,
      status: filter?.status,
      mode: filter?.mode,
      page: filter?.page?.toString(),
      limit: filter?.limit?.toString(),
    }),

  sendNow: (id: string) => apiClient.post<null>(`/notifications/${id}/send-now`),

  cancel: (id: string) => apiClient.delete<null>(`/notifications/${id}`),
};