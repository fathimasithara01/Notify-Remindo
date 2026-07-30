export const SubscriptionPlanStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type SubscriptionPlanStatus = typeof SubscriptionPlanStatus[keyof typeof SubscriptionPlanStatus];

export type Currency =
  | "USD"
  | "EUR"
  | "INR";

export type BillingInterval =
  | "monthly"
  | "yearly"
  | "weekly";


export interface SubscriptionPlan {
  id: string;

  name: string;
  description?: string;

  priceInMinorUnit: number;
  currency: Currency;

  billingInterval: BillingInterval;
  trialDays?: number;

  status: SubscriptionPlanStatus;

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


export type CreateSubscriptionPlanInput =
  Omit< SubscriptionPlan, "id" | "createdAt" | "updatedAt" | "deletedAt"  >;