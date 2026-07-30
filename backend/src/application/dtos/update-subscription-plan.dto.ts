import {
  Currency,
  BillingInterval,
  SubscriptionPlanStatus,
} from "../../domain/entities/subscription-plan.entity";


export interface UpdateSubscriptionPlanDto {
  name?: string;
  description?: string;
  priceInMinorUnit?: number;
  currency?: Currency;
  billingInterval?: BillingInterval;
  trialDays?: number;
  status?: SubscriptionPlanStatus;
}