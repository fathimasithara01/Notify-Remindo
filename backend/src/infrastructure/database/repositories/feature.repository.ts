import { injectable } from 'tsyringe';
import { IFeatureRepository } from '../../../domain/repositories/feature.repository.interface';
import { Feature, NewFeature } from '../../../domain/entities/feature.entity';
import { FeatureModel, FeatureDocument } from '../models/feature.model';

@injectable()
export class FeatureRepository implements IFeatureRepository {
  async create(data: NewFeature): Promise<Feature> {
    const doc = await FeatureModel.create(data);
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Feature | null> {
    const doc = await FeatureModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findByKey(key: string): Promise<Feature | null> {
    const doc = await FeatureModel.findOne({ key });
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, data: Partial<NewFeature>): Promise<Feature | null> {
    const doc = await FeatureModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await FeatureModel.findByIdAndDelete(id);
    return result !== null;
  }

  async list(filter?: { status?: 'active' | 'inactive' }): Promise<Feature[]> {
    const query: Record<string, unknown> = {};
    if (filter?.status) query.status = filter.status;

    const docs = await FeatureModel.find(query);
    return docs.map((doc) => this.toDomain(doc));
  }

  private toDomain(doc: FeatureDocument): Feature {
    return {
      id: doc._id.toString(),
      key: doc.key,
      label: doc.label,
      dataType: doc.dataType,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}