import { apiClient } from './client';
import { SubscriptionPlan, SubscriptionPlanStatus } from '../types/subscription';
import { PaginatedResponse } from '../types/pagination';

export interface CreatePlanPayload {
  name: string;
  userLimit: number;
  durationDays: number;
  price: number;
  description?: string;
}

export type EditPlanPayload = Partial<CreatePlanPayload> & { status?: SubscriptionPlanStatus };

export const subscriptionApi = {
  listPlans: (status?: SubscriptionPlanStatus, page = 1, limit = 100) =>
    apiClient.get<PaginatedResponse<SubscriptionPlan>>('/subscriptions/plans', {
      status,
      page: page.toString(),
      limit: limit.toString(),
    }),

  createPlan: (payload: CreatePlanPayload) =>
    apiClient.post<SubscriptionPlan>('/subscriptions/plans', payload),

  updatePlan: (id: string, payload: EditPlanPayload) =>
    apiClient.patch<SubscriptionPlan>(`/subscriptions/plans/${id}`, payload),

  deletePlan: (id: string) => apiClient.delete<null>(`/subscriptions/plans/${id}`),
};