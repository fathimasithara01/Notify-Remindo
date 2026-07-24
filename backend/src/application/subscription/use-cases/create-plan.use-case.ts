import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { DomainError } from '../../../domain/errors/domain.error';
import { CreatePlanDto } from '../../dtos/create-plan.dto';

export interface CreatePlanInput {
  data: CreatePlanDto;
  adminId: string;
}

@injectable()
export class CreatePlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(input: CreatePlanInput): Promise<SubscriptionPlan> {
    const { data, adminId } = input;

    if (data.userLimit <= 0) {
      throw new DomainError('User limit must be greater than zero');
    }
    if (data.durationDays <= 0) {
      throw new DomainError('Duration must be greater than zero days');
    }

    const plan = await this.planRepo.create({
      name: data.name,
      userLimit: data.userLimit,
      durationDays: data.durationDays,
      price: data.price,
      description: data.description,
    });

    if (data.features?.length) {
      for (const feature of data.features) {
        await this.planRepo.setFeature({
          planId: plan.id,
          featureId: feature.featureId,
          featureValue: feature.featureValue,
        });
      }
    }

    await this.auditLogRepo.create({
      adminId,
      action: 'CREATE_SUBSCRIPTION_PLAN',
      targetType: 'SubscriptionPlan',
      targetId: plan.id,
      metadata: { name: plan.name },
    });

    return plan;
  }
}