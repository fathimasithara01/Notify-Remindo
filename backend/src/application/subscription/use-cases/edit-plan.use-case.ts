import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { NotFoundError } from '../../../domain/errors/domain.error';

export interface EditPlanDto {
  name?: string;
  userLimit?: number;
  durationDays?: number;
  price?: number;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface EditPlanInput {
  planId: string;
  adminId: string;
  data: EditPlanDto;
}

@injectable()
export class EditPlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(input: EditPlanInput): Promise<SubscriptionPlan> {
    const updated = await this.planRepo.update(input.planId, input.data);
    if (!updated) {
      throw new NotFoundError('Subscription plan not found');
    }

    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: 'EDIT_SUBSCRIPTION_PLAN',
      targetType: 'SubscriptionPlan',
      targetId: updated.id,
      metadata: { changes: input.data },
    });

    return updated;
  }
}