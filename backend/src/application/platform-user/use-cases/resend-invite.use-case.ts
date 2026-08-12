// import { EmailNotifierService } from '../../../infrastructure/services/email-notifier.service';
// import { injectable, inject } from 'tsyringe';
// import { TOKENS } from '../../../infrastructure/di/tokens';
// import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
// import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
// import { INotifierService } from '../../../domain/services/notifier.service.interface';
// import { DomainError, NotFoundError } from '../../../domain/errors/domain.error';
// import { generateInviteToken, getInviteExpiry } from '../../../shared/utils/token-generator';
// import { env } from '../../../config/env';
// import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';

// export interface ResendInviteResult {
//   inviteUrl: string;
//   emailSent: boolean;
// }

// @injectable()
// export class UserResendInviteUseCase {
//   constructor(
//     @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
//     @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
//     @inject(TOKENS.EmailNotifierService) private notifierService: INotifierService
//   ) {}

//   async execute(userId: string, adminId: string): Promise<ResendInviteResult> {
//     const user = await this.platformUserRepo.findById(userId);
//     if (!user) throw new NotFoundError('User not found');

//     if (user.status !== 'invited') {
//       throw new DomainError('Only pending invites can be resent. This user has already activated their account.');
//     }

//     // Fresh token — the old link (if the user ever had it) stops working.
//     const inviteToken = generateInviteToken();
//     const inviteTokenExpiresAt = getInviteExpiry(7);

//     await this.platformUserRepo.update(user.id, { inviteToken, inviteTokenExpiresAt });

//     await this.auditLogRepo.create({
//       adminId,
//       action: 'RESEND_INVITE',
//       targetType: 'User',
//       targetId: user.id,
//       metadata: { email: user.email },
//     });

//     const inviteUrl = `${env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;

//     let emailSent = true;
//     try {
//       await this.notifierService.send({
//         to: user.email,
//         subject: "You've been invited to Notify",
//         message: `Hi ${user.firstName}, click the link to set your password: ${inviteUrl}`,
//         html: `<p>Hi ${user.firstName, user.lastName},</p><p>Click below to set your password:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p><p>This link expires in 7 days.</p>`,
//       });
//     } catch (error) {
//       emailSent = false;
//       console.error(`Failed to resend invite email to ${user.email}:`, error);
//     }

//     return { inviteUrl, emailSent };
//   }
// }