import { apiClient } from './client';
import { SubscriptionPlan, SubscriptionPlanStatus } from '../types/subscription';

export const subscriptionApi = {
    listPlans: (status?: SubscriptionPlanStatus) =>
        apiClient.get<SubscriptionPlan[]>('/subscriptions/plans', { status }),
};