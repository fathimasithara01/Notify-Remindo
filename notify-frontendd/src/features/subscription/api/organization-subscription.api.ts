import axiosInstance from "@/lib/axios/axios-instance";

import {
  OrganizationSubscription,
  CreateOrganizationSubscriptionInput,
  OrganizationSubscriptionHistoryParams,
  OrganizationSubscriptionListResponse,
} from "../types/organization-subscription.types";

export const organizationSubscriptionApi = {
  /**
   * Create a subscription for an organization
   */
  async create(
    data: CreateOrganizationSubscriptionInput
  ): Promise<OrganizationSubscription> {
    const response =
      await axiosInstance.post(
        "/subscription-plans/organization-subscriptions",
        data
      );

    return response.data.data;
  },

  /**
   * Get the currently active subscription
   * of an organization
   */
  async getActive(
    organizationId: string
  ): Promise<OrganizationSubscription | null> {
    const response =
      await axiosInstance.get(
        `/subscription-plans/organizations/${organizationId}/subscriptions/active`
      );

    return response.data.data;
  },

  /**
   * Get subscription history
   * of an organization
   */
  async list(
    params: OrganizationSubscriptionHistoryParams
  ): Promise<OrganizationSubscriptionListResponse> {
    const {
      organizationId,
      page,
      limit,
      status,
    } = params;

    const response =
      await axiosInstance.get(
        `/subscription-plans/organizations/${organizationId}/subscriptions`,
        {
          params: {
            page,
            limit,
            status:
              status === "all"
                ? undefined
                : status,
          },
        }
      );

    return response.data.data;
  },

  /**
   * Renew an organization subscription
   */
  async renew(
    id: string
  ): Promise<OrganizationSubscription> {
    const response =
      await axiosInstance.patch(
        `/subscription-plans/organization-subscriptions/${id}/renew`
      );

    return response.data.data;
  },

  /**
   * Cancel an organization subscription
   */
  async cancel(
    id: string,
    reason?: string
  ): Promise<OrganizationSubscription> {
    const response =
      await axiosInstance.patch(
        `/subscription-plans/organization-subscriptions/${id}/cancel`,
        reason
          ? { reason }
          : undefined
      );

    return response.data.data;
  },
};