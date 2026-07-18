import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IFeatureRepository } from '../../../domain/repositories/feature.repository.interface';
import { Feature } from '../../../domain/entities/feature.entity';
import { ConflictError } from '../../../domain/errors/domain.error';

export interface CreateFeatureDto {
  key: string;
  label: string;
  dataType: 'boolean' | 'number' | 'string';
}

@injectable()
export class CreateFeatureUseCase {
  constructor(@inject(TOKENS.FeatureRepository) private featureRepo: IFeatureRepository) {}

  async execute(data: CreateFeatureDto): Promise<Feature> {
    const existing = await this.featureRepo.findByKey(data.key);
    if (existing) {
      throw new ConflictError(`A feature with key "${data.key}" already exists`);
    }

    return this.featureRepo.create({
      key: data.key,
      label: data.label,
      dataType: data.dataType,
    });
  }
}