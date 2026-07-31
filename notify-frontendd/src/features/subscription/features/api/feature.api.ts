import axiosInstance from "@/lib/axios/axios-instance";

import {
  Feature,
  CreateFeatureInput,
} from "../types/feature.types";

export interface FeatureListParams {
  page?: number;

  limit?: number;

  status?:
    | "active"
    | "inactive";

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

  async list(
    params?: FeatureListParams
  ): Promise<FeatureListResponse> {

    const response =
      await axiosInstance.get(
        "/subscription/features",
        {
          params,
        }
      );

    return response.data.data;

  },

  async findById(
    id: string
  ): Promise<Feature> {

    const response =
      await axiosInstance.get(
        `/subscription/features/${id}`
      );

    return response.data.data;

  },

  async create(
    data: CreateFeatureInput
  ): Promise<Feature> {

    const response =
      await axiosInstance.post(
        "/subscription/features",
        data
      );

    return response.data.data;

  },

  async update(
    id: string,
    data: Partial<CreateFeatureInput>
  ): Promise<Feature> {

    const response =
      await axiosInstance.patch(
        `/subscription/features/${id}`,
        data
      );

    return response.data.data;

  },

  async remove(
    id: string
  ): Promise<void> {

    await axiosInstance.delete(
      `/subscription/features/${id}`
    );

  },

};