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
  | "weekly"
  | "monthly"
  | "yearly";

export interface SubscriptionPlan {
  id:string;
  name:string;
  description?:string;
  priceInMinorUnit:number; //Payment gateways (Razorpay, Stripe, etc.) um usually minor units aanu expect cheyyunnath. priceInMinorUnit ennathu subscription plan inte price, currency-yude smallest unit-il store cheyyunnath aanu.
  currency:Currency;
  billingInterval:BillingInterval;
  trialDays?:number;
  status:SubscriptionPlanStatus;
  deletedAt: Date | null;
  createdAt:Date;
  updatedAt:Date;
}

export interface CreateSubscriptionPlanInput {
  name:string;
  description?:string;
  priceInMinorUnit:number;
  currency:Currency;
  billingInterval:BillingInterval;
  trialDays?:number;
  status?:SubscriptionPlanStatus;
}

export interface UpdateSubscriptionPlanInput {
  name?:string;
  description?:string;
  priceInMinorUnit?:number;
  currency?:Currency;
  billingInterval?:BillingInterval;
  trialDays?:number;
  status?:SubscriptionPlanStatus;
}

export interface SubscriptionPlanListFilters {
  page?:number;
  limit?:number;
  status?: SubscriptionPlanStatus;
  search?:string;
}

export interface SubscriptionPlanListResponse {
  items:SubscriptionPlan[];
  total:number;
  page:number;
  limit:number;
  totalPages:number;
}