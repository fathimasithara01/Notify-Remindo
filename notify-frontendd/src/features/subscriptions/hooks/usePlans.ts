'use client';

import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription.api';
import { SubscriptionPlanStatus } from '../types/subscription.types';
import { queryKeys } from '@/lib/query/query-keys';

export function usePlans(status?: SubscriptionPlanStatus) {
    return useQuery({
        queryKey: [...queryKeys.subscriptions.plans(), status],
        queryFn: () => subscriptionApi.listPlans(status),
    });
}