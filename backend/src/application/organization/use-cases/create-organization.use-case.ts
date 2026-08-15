import { injectable, inject } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';

import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';

import { Organization } from '../../../domain/entities/organization.entity';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.entity';
import { ConflictError, DomainError } from '../../../domain/errors/domain.error';
import { CreateOrganizationDto } from '../../dtos/organization/create-organization.dto';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';

const ORG_ADMIN_ROLE_NAME = 'Org Admin';

export interface CreateOrganizationInput {
  data: CreateOrganizationDto;
  adminId: string;
}

export interface CreateOrganizationResult {
  organization: Organization;
  admin: User;
}

@injectable()
export class CreateOrganizationUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository,
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.PlatformRoleRepository) private platformRoleRepo: IPlatformRoleRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.HashService) private hashService: IHashService,
  ) { }

  async execute(input: CreateOrganizationInput): Promise<CreateOrganizationResult> {
    const { data, adminId } = input;

    const plan = data.planId ? await this.planRepo.findById(data.planId) : null;
    if (data.planId && (!plan || plan.status !== 'active')) {
      throw new DomainError('Selected subscription plan is not available');
    }

    const orgAdminRole = await this.platformRoleRepo.findByName(ORG_ADMIN_ROLE_NAME);
    if (!orgAdminRole) {
      throw new DomainError('Org Admin role not found — ensure roles are seeded');
    }

    const existingAdmin = await this.userRepo.findByEmail(data.admin.email);
    if (existingAdmin) {
      throw new ConflictError('This email is already registered. Please use a different email.');
    }

    const existingOrg = await this.orgRepo.findByBusinessEmail(data.businessEmail);
    if (existingOrg) {
      throw new ConflictError('An organization with this business email already exists.');
    }

    const organization = await this.orgRepo.create({
      name: data.name,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      address: data.address,
      status: data.planId ? 'active' : 'pending',
      currentPlanId: data.planId || null,
      salesmanId: data.salesmanId || null,
    });

    const admin = await this.createAdminWithProvidedPassword(data, organization.id, orgAdminRole);

    await this.auditLogRepo.create({
      adminId,
      action: 'CREATE_ORGANIZATION',
      targetType: 'Organization',
      targetId: organization.id,
      metadata: {
        name: organization.name,
        planId: plan?.id ?? null,
        adminUserId: admin.id,
      },
    });

    return { organization, admin };
  }

  private async createAdminWithProvidedPassword(
    data: CreateOrganizationDto,
    organizationId: string,
    orgAdminRole: Role,
  ): Promise<User> {
    const passwordHash = await this.hashService.hash(data.admin.password);

    const admin = await this.userRepo.create({
      firstName: data.admin.firstName,
      lastName: data.admin.lastName,
      email: data.admin.email,
      passwordHash,
      phone: data.admin.phone,
      organizationId,
      roleId: orgAdminRole.id,
    });

    return admin;
  }
}