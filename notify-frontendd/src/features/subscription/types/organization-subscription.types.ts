export type OrganizationSubscriptionStatus =
  | "active"
  | "expired"
  | "cancelled"
  | "pending";


export interface OrganizationSubscriptionPlan {
  id: string;
  name: string;
  description?: string;

  priceInMinorUnit: number;
  currency: "USD" | "EUR" | "INR";

  billingInterval:
    | "weekly"
    | "monthly"
    | "yearly";

  trialDays?: number;
}


export interface OrganizationSubscription {
  id: string;

  organizationId: string;
  planId: string;

  status: OrganizationSubscriptionStatus;

  startDate: string;
  endDate: string;

  trialStartDate?: string | null;
  trialEndDate?: string | null;

  cancelledAt?: string | null;

  createdAt: string;
  updatedAt: string;

  plan?: OrganizationSubscriptionPlan;
}


export interface CreateOrganizationSubscriptionInput {
  organizationId: string;
  planId: string;
}


export interface RenewOrganizationSubscriptionInput {
  id: string;
}


export interface CancelOrganizationSubscriptionInput {
  id: string;
  reason?: string;
}


export interface OrganizationSubscriptionListResponse {
  items: OrganizationSubscription[];

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export interface OrganizationSubscriptionHistoryParams {
  organizationId: string;

  page?: number;
  limit?: number;

  status?:
    | OrganizationSubscriptionStatus
    | "all";
}


export interface ActiveOrganizationSubscriptionParams {
  organizationId: string;
}