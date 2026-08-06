import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { INotifierService } from '../../../domain/services/notifier.service.interface';
import { User } from '../../../domain/entities/user.entity';
import { ConflictError, DomainError } from '../../../domain/errors/domain.error';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { generateInviteToken, getInviteExpiry } from '../../../shared/utils/token-generator';
import { env } from '../../../config/env';

export interface CreateUserInput {
  data: CreateUserDto;
  adminId: string;
}

export interface CreateUserResult {
  user: User;
  inviteUrl: string;
  emailSent: boolean;
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.EmailNotifierService) private notifierService: INotifierService
  ) { }

  async execute(input: CreateUserInput): Promise<CreateUserResult> {
    const { data, adminId } = input;

    if (data.roleIds.length === 0) {
      throw new DomainError('At least one role is required');
    }

    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new ConflictError(`An account already exists for ${data.email}`);
    }

    for (const roleId of data.roleIds) {
      const role = await this.roleRepo.findById(roleId);
      if (!role || role.status !== 'active') {
        throw new DomainError(`Role ${roleId} is not available`);
      }
    }

    const inviteToken = generateInviteToken();
    const inviteTokenExpiresAt = getInviteExpiry(7);

    const user = await this.userRepo.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: null,
      status: 'invited',
      tokenVersion: 0,
      inviteToken,
      inviteTokenExpiresAt,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null
    });

    for (const roleId of data.roleIds) {
      await this.userRepo.assignRole(user.id, roleId);
    }

    await this.auditLogRepo.create({
      adminId,
      action: 'CREATE_USER',
      targetType: 'User',
      targetId: user.id,
      metadata: { email: user.email, roleIds: data.roleIds },
    });

    const inviteUrl = `${env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;

    // Email delivery is best-effort. If it fails, the user record still
    // exists (status: 'invited') and the admin gets inviteUrl back in the
    // response so they can copy/share it manually — no rollback needed.
    let emailSent = true;
    try {
      await this.notifierService.send({
        to: user.email,
        subject: "You've been invited to Notify",
        message: `Hi ${user.name}, you've been invited. Click the link to set your password: ${inviteUrl}`,
        html: `<p>Hi ${user.name},</p><p>You've been invited to Notify. Click below to set your password:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p><p>This link expires in 7 days.</p>`,
      });
    } catch (error) {
      emailSent = false;
      console.error(`Failed to send invite email to ${user.email}:`, error);
    }

    return { user, inviteUrl, emailSent };
  }
}