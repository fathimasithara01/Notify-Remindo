import {
  SubscriptionPlan,
  CreateSubscriptionPlanInput,
  SubscriptionPlanStatus,
} from "../entities/subscription-plan.entity";


export interface SubscriptionPlanListFilters {

  status?: SubscriptionPlanStatus;
  search?: string;
  page?: number;
  limit?: number;

}


export interface SubscriptionPlanListResult {

  items: SubscriptionPlan[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;

}


export interface UpdateSubscriptionPlanInput {

  name?: string;
  description?: string;
  priceAmount?: number;
  currency?: string;
  durationDays?: number;
  userLimit?: number;
  status?: SubscriptionPlanStatus;

}



export interface ISubscriptionPlanRepository {
  create(  data: CreateSubscriptionPlanInput): Promise<SubscriptionPlan>;
  findById( id: string): Promise<SubscriptionPlan | null>;
  findActivePlans(): Promise<SubscriptionPlan[]>;

  update(  id: string,  data: UpdateSubscriptionPlanInput): Promise<SubscriptionPlan | null>;
  softDelete( id: string): Promise<boolean>;
  list(filters?: SubscriptionPlanListFilters): Promise<SubscriptionPlanListResult>;
  existsByName(name:string):Promise<boolean>;

}