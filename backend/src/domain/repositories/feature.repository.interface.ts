import { Feature, NewFeature } from '../entities/feature.entity';

export interface IFeatureRepository {
  create(data: NewFeature): Promise<Feature>;
  findById(id: string): Promise<Feature | null>;
  findByKey(key: string): Promise<Feature | null>;
  update(id: string, data: Partial<NewFeature>): Promise<Feature | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: { status?: 'active' | 'inactive' }): Promise<Feature[]>;
}