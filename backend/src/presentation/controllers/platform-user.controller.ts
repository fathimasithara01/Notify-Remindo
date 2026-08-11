import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { CreatePlatformUserUseCase } from '../../application/platform-user/use-cases/create-platform-user.use-case';
import { EditPlatformUserUseCase } from '../../application/platform-user/use-cases/edit-platform-user.use-case';
import { ListPlatformUsersUseCase } from '../../application/platform-user/use-cases/list-platform-users.use-case';
import { DeletePlatformUserUseCase } from '../../application/platform-user/use-cases/delete-platform-user.use-case';
import { parsePaginationParams } from '../../shared/utils/pagination';
import { ApiResponse } from '../../shared/utils/api-response';
import { RevokeSessionsUseCase } from '../../application/platform-user/use-cases/revoke-sessions.use-case';
import { UserResendInviteUseCase } from '../../application/platform-user/use-cases/resend-invite.use-case';
import { RequestPasswordResetUseCase } from '../../application/platform-user/use-cases/request-password-reset.use-case';
import { UnauthorizedError } from '../../domain/errors/domain.error';

@injectable()
export class PlatformUserController {
    constructor(
        @inject(TOKENS.CreatePlatformUserUseCase) private createUseCase: CreatePlatformUserUseCase,
        @inject(TOKENS.EditPlatformUserUseCase) private editUseCase: EditPlatformUserUseCase,
        @inject(TOKENS.ListPlatformUsersUseCase) private listUseCase: ListPlatformUsersUseCase,
        @inject(TOKENS.DeletePlatformUserUseCase) private deleteUseCase: DeletePlatformUserUseCase,
        @inject(TOKENS.RevokeSessionsUseCase) private revokeSessionsUseCase: RevokeSessionsUseCase,
        @inject(TOKENS.ResendInviteUseCase) private resendInviteUseCase: UserResendInviteUseCase,
        @inject(TOKENS.RequestPasswordResetUseCase) private requestPasswordResetUseCase: RequestPasswordResetUseCase
    ) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user, temporaryPassword } = await this.createUseCase.execute(req.body);
            // TODO: send temporaryPassword via email using EmailNotifierService, do not return it in response
            res.status(201).json({ success: true, data: user });
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.editUseCase.execute({ id: req.params.id, ...req.body });
            res.status(200).json({ success: true, data: user });
        } catch (err) {
            next(err);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pagination = parsePaginationParams(req.query);
            const result = await this.listUseCase.execute({
                status: req.query.status as any,
                search: req.query.search as string | undefined,
                pagination,
            });
            res.status(200).json({ success: true, data: result.items, meta: result.meta });
        } catch (err) {
            next(err);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUser = req.user as { id: string };
            await this.deleteUseCase.execute({ id: req.params.id, requestedBy: currentUser.id });
            res.status(200).json({ success: true, message: 'Platform user deleted' });
        } catch (err) {
            next(err);
        }
    };

    resendInvite = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) throw new UnauthorizedError();
        const result = await this.resendInviteUseCase.execute(req.params.id, req.user.id);
        ApiResponse.success(res, result, 200, 'Invite resent');
    };

    requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) throw new UnauthorizedError();
        const result = await this.requestPasswordResetUseCase.execute(req.params.id, req.user.id);
        ApiResponse.success(res, result, 200, 'Password reset link sent');
    };

    revokeSessions = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) throw new UnauthorizedError();
        await this.revokeSessionsUseCase.execute({ userId: req.params.id, adminId: req.user.id });
        ApiResponse.success(res, null, 200, 'All sessions revoked for this user');
    };
}