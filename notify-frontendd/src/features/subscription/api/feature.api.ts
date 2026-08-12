import { apiClient } from '@/lib/api/client';
import { PaginatedResult } from '@/types/pagination';
import {
  Feature,
  CreateFeatureInput,
  UpdateFeatureInput,
  FeatureFilters,
} from '../types/feature.types';

export const featureApi = {
  list: (filters?: FeatureFilters) =>
    apiClient.get<PaginatedResult<Feature>>('/features', {
      status: filters?.status,
      search: filters?.search,
      page: filters?.page?.toString(),
      limit: filters?.limit?.toString(),
    }),

  getOne: (id: string) =>
    apiClient.get<Feature>(`/features/${id}`),

  create: (payload: CreateFeatureInput) =>
    apiClient.post<Feature>('/features', payload),

  update: (id: string, payload: UpdateFeatureInput) =>
    apiClient.patch<Feature>(`/features/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<null>(`/features/${id}`),

  block: (id: string) =>
    apiClient.post<Feature>(`/features/${id}/block`),

  unblock: (id: string) =>
    apiClient.post<Feature>(`/features/${id}/unblock`),
};