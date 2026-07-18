import { Request, Response, CookieOptions } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { LoginAdminUseCase } from '../../application/auth/use-cases/login-admin.use-case';
import { RefreshTokenUseCase } from '../../application/auth/use-cases/refresh-token.use-case';
import { GetCurrentUserUseCase } from '../../application/auth/use-cases/get-current-user.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { UnauthorizedError } from '../../domain/errors/domain.error';
import { env } from '../../config/env';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,
};

@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.LoginAdminUseCase) private loginUseCase: LoginAdminUseCase,
    @inject(TOKENS.RefreshTokenUseCase) private refreshTokenUseCase: RefreshTokenUseCase,
    @inject(TOKENS.GetCurrentUserUseCase) private getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.loginUseCase.execute(req.body);
    res.cookie('token', result.token, COOKIE_OPTIONS);
    ApiResponse.success(res, { user: result.user });
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('token', COOKIE_OPTIONS);
    ApiResponse.success(res, null, 200, 'Logged out');
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const result = await this.refreshTokenUseCase.execute(req.user.userId);
    res.cookie('token', result.token, COOKIE_OPTIONS);
    ApiResponse.success(res, null, 200, 'Token refreshed');
  };

  me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const result = await this.getCurrentUserUseCase.execute(req.user.userId);
    ApiResponse.success(res, result);
  };
}