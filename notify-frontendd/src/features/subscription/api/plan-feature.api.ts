import axiosInstance from "@/lib/api/axios-instance";

import {
  PlanFeature,
  PlanFeatureWithDetails,
  CreatePlanFeatureInput,
} from "../types/plan-feature.types";

export interface PlanFeatureListResponse {
  items: PlanFeatureWithDetails[];
  total: number;
}

export const planFeatureApi = {

  /**
   * Add a feature to a subscription plan
   */
  async add(
    planId: string,
    data: Omit<CreatePlanFeatureInput, "planId">
  ): Promise<PlanFeature> {

    const response =
      await axiosInstance.post(
        `/subscription-plans/plans/${planId}/features`,
        data
      );

    return response.data.data;
  },


  /**
   * Get all features assigned to a plan
   */
  async list(
    planId: string
  ): Promise<PlanFeatureListResponse> {

    const response =
      await axiosInstance.get(
        `/subscription-plans/plans/${planId}/features`
      );

    return response.data.data;
  },


  /**
   * Remove a feature from a plan
   */
  async remove(
    planId: string,
    featureId: string
  ): Promise<void> {

    await axiosInstance.delete(
      `/subscription-plans/plans/${planId}/features/${featureId}`
    );

  },

};