import { apiClient } from '@/lib/api/client';
import { CreateFeatureInput, Feature } from '../types/feature.types';
import { toQueryParams } from '@/features/rbac/shared/query-params';

const BASE_URL = '/subscription-plans/features';

export interface FeatureListParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  search?: string;
}

export interface FeatureListResponse {
  items: Feature[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const featureApi = {
  list: (params?: FeatureListParams): Promise<FeatureListResponse> =>
    apiClient.get<FeatureListResponse>(
      BASE_URL,
      toQueryParams(params ?? {}),
    ),

  findById: (id: string): Promise<Feature> =>
    apiClient.get<Feature>(
      `${BASE_URL}/${id}`
    ),

  create: (data: CreateFeatureInput): Promise<Feature> =>
    apiClient.post<Feature>(
      BASE_URL,
      data
    ),

  update: (
    id: string,
    data: Partial<CreateFeatureInput>
  ): Promise<Feature> =>
    apiClient.patch<Feature>(
      `${BASE_URL}/${id}`,
      data
    ),

  remove: (id: string): Promise<void> =>
    apiClient.delete<void>(
      `${BASE_URL}/${id}`
    ),
};