import { SubscriptionPlan, NewSubscriptionPlan } from '../entities/subscription-plan.entity';
import { PlanFeature, NewPlanFeature, PlanFeatureWithDefinition } from '../entities/plan-feature.entity';
import {
  OrganizationSubscription,
  NewOrganizationSubscription,
} from '../entities/organization-subscription.entity';

export interface ISubscriptionPlanRepository {
  create(data: NewSubscriptionPlan): Promise<SubscriptionPlan>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  update(id: string, data: Partial<NewSubscriptionPlan>): Promise<SubscriptionPlan | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: { status?: 'active' | 'inactive' }): Promise<SubscriptionPlan[]>;

  setFeature(data: NewPlanFeature): Promise<PlanFeature>;
  removeFeature(planId: string, featureId: string): Promise<boolean>;
  listFeatures(planId: string): Promise<PlanFeatureWithDefinition[]>;

  createSubscriptionRecord(data: NewOrganizationSubscription): Promise<OrganizationSubscription>;
  listSubscriptionHistory(organizationId: string): Promise<OrganizationSubscription[]>;
  closeSubscriptionRecord( id: string,newStatus: 'upgraded' | 'expired' | 'cancelled'): Promise<void>;
}