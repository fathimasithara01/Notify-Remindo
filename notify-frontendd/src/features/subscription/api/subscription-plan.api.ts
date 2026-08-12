import { apiClient } from '@/lib/api/client';
import { PaginatedResult } from '@/types/pagination';
import {
  SubscriptionPlan,
  CreateSubscriptionPlanInput,
  UpdateSubscriptionPlanInput,
  SubscriptionPlanFilters,
} from '../types/subscription-plan.types';

export const subscriptionPlanApi = {
  list: (filters?: SubscriptionPlanFilters) =>
    apiClient.get<PaginatedResult<SubscriptionPlan>>('/subscription-plans', {
      status: filters?.status,
      currency: filters?.currency,
      search: filters?.search,
      page: filters?.page?.toString(),
      limit: filters?.limit?.toString(),
    }),

  getOne: (id: string) =>
    apiClient.get<SubscriptionPlan>(`/subscription-plans/${id}`),

  create: (payload: CreateSubscriptionPlanInput) =>
    apiClient.post<SubscriptionPlan>('/subscription-plans', payload),

  update: (id: string, payload: UpdateSubscriptionPlanInput) =>
    apiClient.patch<SubscriptionPlan>(`/subscription-plans/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<null>(`/subscription-plans/${id}`),

  block: (id: string) =>
    apiClient.post<SubscriptionPlan>(`/subscription-plans/${id}/block`),

  unblock: (id: string) =>
    apiClient.post<SubscriptionPlan>(`/subscription-plans/${id}/unblock`),
};