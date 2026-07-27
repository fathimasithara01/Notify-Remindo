import { apiClient } from '@/lib/api/client';
import { PaginatedResponse } from '@/types/pagination';
import { SubscriptionPlan, SubscriptionPlanStatus } from '../types/subscription.types';

export const subscriptionApi = {
    listPlans: (status?: SubscriptionPlanStatus) =>
        apiClient.get<PaginatedResponse<SubscriptionPlan>>('/subscriptions/plans', { status }),
};