import axiosInstance from "@/lib/axios/axios-instance";

import {
    SubscriptionPlan,
    CreateSubscriptionPlanInput,
} from "../types/subscription-plan.types";

export interface SubscriptionPlanListParams {
    page?: number;
    limit?: number;
    status?:
    "draft" |
    "active" |
    "inactive";
    search?: string;
}

export interface SubscriptionPlanListResponse {
    items: SubscriptionPlan[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const subscriptionPlanApi = {
    async list(params?: SubscriptionPlanListParams): Promise<SubscriptionPlanListResponse> {
        const response = await axiosInstance.get("/subscription-plans", { params });
        return response.data.data;
    },

    async findById(id: string): Promise<SubscriptionPlan> {
        const response = await axiosInstance.get(`/subscription-plans/${id}`);
        return response.data.data;
    },

    async create(data: CreateSubscriptionPlanInput): Promise<SubscriptionPlan> {
        const response = await axiosInstance.post("/subscription-plans", data);
        return response.data.data;
    },

    async update(id: string, data: Partial<CreateSubscriptionPlanInput>): Promise<SubscriptionPlan> {
        const response = await axiosInstance.patch(`/subscription-plans/${id}`, data);
        return response.data.data;
    },

    async remove(id: string): Promise<void> {
        await axiosInstance.delete(`/subscription-plans/${id}`);
    },
};