import {
    PlanFeature,
    CreatePlanFeatureInput,
    PlanFeatureWithDefinition,
} from "../entities/plan-feature.entity";


export interface PlanFeatureListFilters {
    planId: string;
    featureId?: string;
}

export interface IPlanFeatureRepository {
    create(data: CreatePlanFeatureInput): Promise<PlanFeature>;//  Attach a feature to a subscription plan
    findByPlanAndFeature(planId: string, featureId: string): Promise<PlanFeature | null>;
    update(planId: string, featureId: string, featureValue: string | number | boolean): Promise<PlanFeature | null>;
    listByPlan(planId: string): Promise<PlanFeatureWithDefinition[]>;
    remove(planId: string, featureId: string): Promise<boolean>;
    listByFeature(featureId: string): Promise<PlanFeature[]>;
}