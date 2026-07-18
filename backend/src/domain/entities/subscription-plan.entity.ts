export type SubscriptionPlanStatus = 'active' | 'inactive';

export interface SubscriptionPlan {
  id: string;
  name: string; 
  userLimit: number;
  durationDays: number;
  price: number;
  status: SubscriptionPlanStatus;
  description?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewSubscriptionPlan = Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: SubscriptionPlanStatus;
};