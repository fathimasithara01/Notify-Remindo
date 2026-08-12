import {
  SubscriptionPlan,
  CreateSubscriptionPlanInput,
  SubscriptionPlanStatus,
} from "../entities/subscription-plan.entity";

export interface SubscriptionPlanListFilters {
  status?: SubscriptionPlanStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SubscriptionPlanListResult {
  items: SubscriptionPlan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateSubscriptionPlanInput {
  title?: string;
  description?: string;
  amountValue?: number;
  currency?: SubscriptionPlan["currency"];
  userLimit?: number;
  storageLimit?: number;
  featureIds?: string[];
  status?: SubscriptionPlanStatus;
}

export interface ISubscriptionPlanRepository {
  create(data: CreateSubscriptionPlanInput): Promise<SubscriptionPlan>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  findByTitle(title: string): Promise<SubscriptionPlan | null>;
  findActivePlans(): Promise<SubscriptionPlan[]>;
  countByFeatureId(featureId: string): Promise<number>;
  update(id: string, data: UpdateSubscriptionPlanInput): Promise<SubscriptionPlan | null>;
  softDelete(id: string): Promise<boolean>;
  list(filters?: SubscriptionPlanListFilters): Promise<SubscriptionPlanListResult>;
}