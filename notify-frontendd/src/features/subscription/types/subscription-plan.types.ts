export const SubscriptionPlanStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type SubscriptionPlanStatus =
  (typeof SubscriptionPlanStatus)[keyof typeof SubscriptionPlanStatus];

export type Currency = "USD" | "EUR" | "INR";

export interface SubscriptionPlan {
  id: string;
  title: string;
  description?: string;
  amountValue: number;
  currency: Currency;
  userLimit: number;
  storageLimit: number;
  featureIds: string[];
  status: SubscriptionPlanStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateSubscriptionPlanInput = Omit<SubscriptionPlan,
  "id" | "status" | "createdAt" | "updatedAt" | "deletedAt"
>;


export type UpdateSubscriptionPlanInput = Partial<CreateSubscriptionPlanInput>;

export interface SubscriptionPlanFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: SubscriptionPlanStatus;
  currency?: Currency;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
