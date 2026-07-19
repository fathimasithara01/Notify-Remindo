export type SubscriptionPlanStatus = 'active' | 'inactive';

export interface SubscriptionPlan {
  id: string;
  name: string;
  userLimit: number;
  durationDays: number;
  price: number;
  status: SubscriptionPlanStatus;
  description?: string;
}
