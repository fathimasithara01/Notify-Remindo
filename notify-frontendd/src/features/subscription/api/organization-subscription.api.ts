import { apiClient } from '@/lib/api/client';
import {
  OrganizationSubscription,
  CreateOrganizationSubscriptionInput,
  OrganizationSubscriptionHistoryParams,
  OrganizationSubscriptionListResponse,
} from '../types/organization-subscription.types';

const BASE_URL = '/subscription-plans/organization-subscriptions';

export const organizationSubscriptionApi = {
  create: (
    data: CreateOrganizationSubscriptionInput
  ): Promise<OrganizationSubscription> =>
    apiClient.post<OrganizationSubscription>(
      BASE_URL,
      data
    ),

  /**
   * Get the currently active subscription
   * of an organization
   */
  getActive: (
    organizationId: string
  ): Promise<OrganizationSubscription | null> =>
    apiClient.get<OrganizationSubscription | null>(
      `/subscription-plans/organizations/${organizationId}/subscriptions/active`
    ),

  /**
   * Get subscription history
   * of an organization
   */
  list: (
    params: OrganizationSubscriptionHistoryParams
  ): Promise<OrganizationSubscriptionListResponse> => {
    const { organizationId, page, limit, status } = params;

    return apiClient.get<OrganizationSubscriptionListResponse>(
      `/subscription-plans/organizations/${organizationId}/subscriptions`,
      {
        page,
        limit,
        status: status === 'all' ? undefined : status,
      }
    );
  },

  /**
   * Renew an organization subscription
   */
  renew: (
    id: string
  ): Promise<OrganizationSubscription> =>
    apiClient.patch<OrganizationSubscription>(
      `${BASE_URL}/${id}/renew`
    ),

  /**
   * Cancel an organization subscription
   */
  cancel: (
    id: string,
    reason?: string
  ): Promise<OrganizationSubscription> =>
    apiClient.patch<OrganizationSubscription>(
      `${BASE_URL}/${id}/cancel`,
      reason ? { reason } : undefined
    ),
};