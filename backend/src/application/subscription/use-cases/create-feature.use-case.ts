import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IFeatureRepository } from '../../../domain/repositories/feature.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { Feature } from '../../../domain/entities/feature.entity';
import { ConflictError } from '../../../domain/errors/domain.error';

export interface CreateFeatureDto {
  key: string;
  label: string;
  dataType: 'boolean' | 'number' | 'string';
}

export interface CreateFeatureInput {
  data: CreateFeatureDto;
  adminId: string;
}

@injectable()
export class CreateFeatureUseCase {
  constructor(
    @inject(TOKENS.FeatureRepository) private featureRepo: IFeatureRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository
  ) { }

  async execute(input: CreateFeatureInput): Promise<Feature> {
    const { data, adminId } = input;

    const existing = await this.featureRepo.findByKey(data.key);
    if (existing) {
      throw new ConflictError(`A feature with key "${data.key}" already exists`);
    }

    const feature = await this.featureRepo.create({
      key: data.key,
      label: data.label,
      dataType: data.dataType,
    });

    await this.auditLogRepo.create({
      adminId,
      action: 'CREATE_FEATURE',
      targetType: 'Feature',
      targetId: feature.id,
      metadata: { key: feature.key },
    });

    return feature;
  }
}