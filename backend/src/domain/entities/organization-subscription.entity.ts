import {
  Currency,
  BillingInterval,
} from "./subscription-plan.entity";


export const OrganizationSubscriptionStatus = {

  ACTIVE: "active",
  UPGRADED: "upgraded",
  EXPIRED: "expired",
  CANCELLED: "cancelled",

} as const;



export type OrganizationSubscriptionStatus =
  typeof OrganizationSubscriptionStatus[
    keyof typeof OrganizationSubscriptionStatus
  ];



export interface OrganizationSubscription {

  id: string;


  organizationId: string;


  planId: string;



  startDate: Date;


  endDate: Date;



  nextBillingDate?: Date | null;



  priceInMinorUnit: number;



  currency: Currency;


  billingInterval: BillingInterval;



  paymentProvider?: string;


  paymentTransactionId?: string;



  autoRenew: boolean;



  status: OrganizationSubscriptionStatus;



  cancelledAt?: Date | null;



  createdAt: Date;


  updatedAt: Date;

}



export type CreateOrganizationSubscriptionInput =
  Omit<
    OrganizationSubscription,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "cancelledAt"
  >;