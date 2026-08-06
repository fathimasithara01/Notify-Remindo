import {
  BillingInterval,
  Currency,
} from "../../domain/entities/subscription-plan.entity";


export interface CreateSubscriptionDto {
  organizationId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  priceInMinorUnit: number;
  currency: Currency;
  billingInterval: BillingInterval;
  paymentProvider?: string;
  paymentTransactionId?: string;
  autoRenew?: boolean;
}