import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';

import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';

import {
  DomainError,
  NotFoundError,
  ValidationError,
} from '../../../domain/errors/domain.error';

interface SetOrganizationAdminPasswordInput {
  organizationId: string;
  password: string;
  adminId: string;
}

@injectable()
export class SetOrganizationAdminPasswordUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TOKENS.OrganizationRepository) private readonly orgRepo: IOrganizationRepository,
    @inject(TOKENS.AuditLogRepository) private readonly auditLogRepository: IAuditLogRepository,
  ) {}

  async execute(input: SetOrganizationAdminPasswordInput): Promise<void> {
    // 1. Validate password policy first — fail fast before any DB round-trip
    this.validatePassword(input.password);

    // 2. Verify organization exists
    const organization = await this.orgRepo.findById(input.organizationId);

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // 3. Find organization admin user
    const organizationAdmin = await this.userRepository.findOrganizationAdmin(
      input.organizationId,
    );

    if (!organizationAdmin) {
      throw new NotFoundError('Organization admin not found');
    }

    // 4. Only an active admin can have a password set for them
    if (organization.status !== 'active') {
      throw new DomainError('Password can only be set for an active organization admin.');
    }

    // 5. Hash password
    const passwordHash = await bcrypt.hash(input.password, 12);

    // 6. Update password and bump tokenVersion to invalidate existing sessions
    const updated = await this.userRepository.resetPassword(
      organizationAdmin.id,
      passwordHash,
    );

    if (!updated) {
      throw new Error('Unable to reset password');
    }

   
    // 7. Create audit trail
    await this.auditLogRepository.create({
      adminId: input.adminId,
      action: 'RESET_ORGANIZATION_ADMIN_PASSWORD',
      targetType: 'User',
      targetId: organizationAdmin.id,
      metadata: {
        organizationId: input.organizationId,
        email: organizationAdmin.email,
      },
    });
  }

  private validatePassword(password: string): void {
    const rules = [
      {
        valid: password.length >= 8,
        message: 'Password must contain minimum 8 characters',
      },
      {
        valid: /[A-Z]/.test(password),
        message: 'Password must contain uppercase letter',
      },
      {
        valid: /[a-z]/.test(password),
        message: 'Password must contain lowercase letter',
      },
      {
        valid: /[0-9]/.test(password),
        message: 'Password must contain number',
      },
      {
        valid: /[^A-Za-z0-9]/.test(password),
        message: 'Password must contain special character',
      },
    ];

    const failedRule = rules.find((rule) => !rule.valid);

    if (failedRule) {
      throw new ValidationError(failedRule.message);
    }
  }
}