export type PlanFeatureValue = string | boolean | number;

export interface PlanFeature {
  id: string;
  planId: string;
  featureId: string;
  featureValue: PlanFeatureValue;
  createdAt: Date;
  updatedAt: Date;
}

export type NewPlanFeature = Omit<PlanFeature, 'id' | 'createdAt' | 'updatedAt'>;

export interface PlanFeatureWithDefinition extends PlanFeature {
  key: string;
  label: string;
  dataType: 'boolean' | 'number' | 'string';
}