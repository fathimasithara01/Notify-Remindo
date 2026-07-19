import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';

export interface BusinessReport {
  totalOrganizations: number;
  activeOrganizations: number;
  blockedOrganizations: number;
  totalActivePlans: number;
  organizationsByPlan: Record<string, number>;
}

@injectable()
export class GetBusinessReportUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository
  ) { }

  async execute(): Promise<BusinessReport> {
    const [allOrgs, activeOrgs, blockedOrgs, activePlans] = await Promise.all([
      this.orgRepo.list(),
      this.orgRepo.list({ status: 'active' }),
      this.orgRepo.list({ status: 'blocked' }),
      this.planRepo.list({ status: 'active' }),
    ]);

    const organizationsByPlan: Record<string, number> = {};
    for (const org of allOrgs) {
      organizationsByPlan[org.currentPlanId] = (organizationsByPlan[org.currentPlanId] ?? 0) + 1;
    }

    return {
      totalOrganizations: allOrgs.length,
      activeOrganizations: activeOrgs.length,
      blockedOrganizations: blockedOrgs.length,
      totalActivePlans: activePlans.length,
      organizationsByPlan,
    };
  }
}