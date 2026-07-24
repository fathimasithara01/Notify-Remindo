import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { ResendInviteUseCase } from '../../application/organization/use-cases/resend-invite.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError, DomainError, UnauthorizedError } from '../../domain/errors/domain.error';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';

@injectable()
export class InviteController {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.ResendInviteUseCase) private resendInviteUseCase: ResendInviteUseCase
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const invited = await this.userRepo.list({ status: 'invited' });

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = invited.slice(start, start + pagination.limit).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      organizationId: u.organizationId,
      inviteTokenExpiresAt: u.inviteTokenExpiresAt,
      createdAt: u.createdAt,
    }));

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(invited.length, pagination),
    });
  };

  resend = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const { organizationId } = req.body;
    if (!organizationId) {
      throw new DomainError('organizationId is required');
    }

    await this.resendInviteUseCase.execute({ organizationId, adminId: req.user.userId });
    ApiResponse.success(res, null, 200, 'Invite resent');
  };

  cancel = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const invitedUser = await this.userRepo.findById(req.params.id);
    if (!invitedUser || invitedUser.status !== 'invited') {
      throw new NotFoundError('Pending invite not found');
    }

    await this.userRepo.delete(invitedUser.id);

    await this.auditLogRepo.create({
      adminId: req.user.userId,
      action: 'CANCEL_INVITE',
      targetType: 'User',
      targetId: invitedUser.id,
      metadata: { email: invitedUser.email },
    });

    ApiResponse.success(res, null, 200, 'Invite cancelled');
  };
}