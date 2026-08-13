import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { INotifierService } from '../../../domain/services/notifier.service.interface';
import { User } from '../../../domain/entities/user.entity';
import { ConflictError, DomainError, NotFoundError } from '../../../domain/errors/domain.error';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { generateInviteToken, getInviteExpiry } from '../../../shared/utils/token-generator';
import { env } from '../../../config/env';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';

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
    @inject(TOKENS.UserRepository) private readonly userRepo: IUserRepository,
    @inject(TOKENS.PlatformRoleRepository) private readonly roleRepo: IPlatformRoleRepository,
    @inject(TOKENS.AuditLogRepository) private readonly auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.EmailNotifierService) private readonly notifierService: INotifierService
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserResult> {
    const { data, adminId } = input;

    if (!data.roleId) {
      throw new DomainError('A role is required');
    }

    const admin = await this.userRepo.findById(adminId);
    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    const existing = await this.userRepo.findByEmail(data.email, admin.organizationId);
    if (existing) {
      throw new ConflictError(`An account already exists for ${data.email}`);
    }

    const role = await this.roleRepo.findById(data.roleId);
    if (!role || role.status !== 'active') {
      throw new DomainError(`Role ${data.roleId} is not available`);
    }

    const inviteToken = generateInviteToken();
    const inviteTokenExpiresAt = getInviteExpiry(7);

    const user = await this.userRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: null,
      phone:data.phone,
      organizationId: admin.organizationId,
      roleId: data.roleId,
      inviteToken,
      inviteTokenExpiresAt,
        // mustChangePassword: true,
    });

    await this.auditLogRepo.create({
      adminId,
      action: 'CREATE_USER',
      targetType: 'User',
      targetId: user.id,
      metadata: { email: user.email, roleId: data.roleId },
    });

    const inviteUrl = `${env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;

    let emailSent = true;
    try {
      await this.notifierService.send({
        to: user.email,
        subject: "You've been invited to Notify",
        message: `Hi ${user.firstName}, you've been invited. Click the link to set your password: ${inviteUrl}`,
        html: `<p>Hi ${user.firstName},</p><p>You've been invited to Notify. Click below to set your password:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p><p>This link expires in 7 days.</p>`,
      });
    } catch (error) {
      emailSent = false;
      console.error(`Failed to send invite email to ${user.email}:`, error);
    }

    return { user, inviteUrl, emailSent };
  }
}