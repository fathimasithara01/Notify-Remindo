import { apiClient } from '@/lib/api/client';

import {
  PlanFeature,
  PlanFeatureWithDetails,
  CreatePlanFeatureInput,
} from '../types/plan-feature.types';

const BASE_URL = '/subscription-plans/plans';

export interface PlanFeatureListResponse {
  items: PlanFeatureWithDetails[];
  total: number;
}

export const planFeatureApi = {
  /**
   * Add a feature to a subscription plan
   */
  add: (
    planId: string,
    data: Omit<CreatePlanFeatureInput, 'planId'>
  ): Promise<PlanFeature> =>
    apiClient.post<PlanFeature>(
      `${BASE_URL}/${planId}/features`,
      data
    ),

  /**
   * Get all features assigned to a plan
   */
  list: (
    planId: string
  ): Promise<PlanFeatureListResponse> =>
    apiClient.get<PlanFeatureListResponse>(
      `${BASE_URL}/${planId}/features`
    ),

  /**
   * Remove a feature from a plan
   */
  remove: (
    planId: string,
    featureId: string
  ): Promise<void> =>
    apiClient.delete<void>(
      `${BASE_URL}/${planId}/features/${featureId}`
    ),
};