import { apiClient } from './client';
import { SubscriptionPlan, SubscriptionPlanStatus } from '../types/subscription';

export interface CreatePlanPayload {
    name: string;
    userLimit: number;
    durationDays: number;
    price: number;
    description?: string;
}

export const subscriptionApi = {
    listPlans: (status?: SubscriptionPlanStatus) => apiClient.get<SubscriptionPlan[]>('/subscriptions/plans', { status }),

    createPlan: (payload: CreatePlanPayload) => apiClient.post<SubscriptionPlan>('/subscriptions/plans', payload),

    deletePlan: (id: string) => apiClient.delete<null>(`/subscriptions/plans/${id}`),
};