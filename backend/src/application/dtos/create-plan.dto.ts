export interface CreatePlanDto {
  name: string;
  userLimit: number;
  durationDays: number;
  price: number;
  description?: string;
  features?: Array<{ featureId: string; featureValue: string | boolean | number }>;
}