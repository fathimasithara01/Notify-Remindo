export type OrganizationSubscriptionStatus = 'active' | 'upgraded' | 'expired' | 'cancelled';

export interface OrganizationSubscription {
  id: string;
  organizationId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: OrganizationSubscriptionStatus;
  createdAt: Date;
}

export type NewOrganizationSubscription = Omit<OrganizationSubscription, 'id' | 'createdAt'>;