export const SubscriptionPlanStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type SubscriptionPlanStatus = (typeof SubscriptionPlanStatus)[keyof typeof SubscriptionPlanStatus];

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

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateSubscriptionPlanInput = Omit<
  SubscriptionPlan,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;