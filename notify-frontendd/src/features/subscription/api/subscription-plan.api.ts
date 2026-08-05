import { apiClient } from '@/lib/api/client';
import { toQueryParams } from '@/features/rbac/shared/query-params';
import {
  SubscriptionPlan,
  CreateSubscriptionPlanInput,
} from '../types/subscription-plan.types';

const BASE_URL = '/subscription-plans';

export interface SubscriptionPlanListParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'active' | 'inactive';
  search?: string;
}

export interface SubscriptionPlanListResponse {
  items: SubscriptionPlan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const subscriptionPlanApi = {
  list: (
    params?: SubscriptionPlanListParams
  ): Promise<SubscriptionPlanListResponse> =>
    apiClient.get<SubscriptionPlanListResponse>(
      BASE_URL,
      toQueryParams(params ?? {})
    ),

  findById: (
    id: string
  ): Promise<SubscriptionPlan> =>
    apiClient.get<SubscriptionPlan>(
      `${BASE_URL}/${id}`
    ),

  create: (
    data: CreateSubscriptionPlanInput
  ): Promise<SubscriptionPlan> =>
    apiClient.post<SubscriptionPlan>(
      BASE_URL,
      data
    ),

  update: (
    id: string,
    data: Partial<CreateSubscriptionPlanInput>
  ): Promise<SubscriptionPlan> =>
    apiClient.patch<SubscriptionPlan>(
      `${BASE_URL}/${id}`,
      data
    ),

  remove: (
    id: string
  ): Promise<void> =>
    apiClient.delete<void>(
      `${BASE_URL}/${id}`
    ),
};