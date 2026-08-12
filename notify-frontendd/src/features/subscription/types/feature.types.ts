export const FeatureStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type FeatureStatus = (typeof FeatureStatus)[keyof typeof FeatureStatus];


export interface FeatureFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: FeatureStatus;
}

export interface Feature {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: FeatureStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateFeatureInput = Omit<Feature,
  "id" | "status" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type UpdateFeatureInput = Partial<CreateFeatureInput>;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
