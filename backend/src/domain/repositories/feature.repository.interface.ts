import {
  Feature,
  CreateFeatureInput,
  UpdateFeatureInput,
  FeatureStatus,
} from "../entities/feature.entity";

export interface FeatureListFilters {
  status?: FeatureStatus;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface FeatureListResult {
  items: Feature[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IFeatureRepository {
  create(data: CreateFeatureInput): Promise<Feature>;
  findById(id: string): Promise<Feature | null>;
  findByIds(ids: string[]): Promise<Feature[]>;
  findByTitle(title: string): Promise<Feature | null>;
  update(id: string, data: UpdateFeatureInput): Promise<Feature | null>;
  softDelete(id: string): Promise<boolean>;
  list(filters?: FeatureListFilters): Promise<FeatureListResult>;
  getCategories(): Promise<string[]>;  
}