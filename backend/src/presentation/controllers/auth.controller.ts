import { Request, Response, CookieOptions } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { LoginAdminUseCase } from '../../application/auth/use-cases/login-admin.use-case';
import { RefreshTokenUseCase } from '../../application/auth/use-cases/refresh-token.use-case';
import { GetCurrentUserUseCase } from '../../application/auth/use-cases/get-current-user.use-case';
import { VerifyInviteTokenUseCase } from '../../application/auth/use-cases/verify-invite-token.use-case';
import { AcceptInviteUseCase } from '../../application/auth/use-cases/accept-invite.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { UnauthorizedError } from '../../domain/errors/domain.error';
import { env } from '../../config/env';

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
};

const ACCESS_TOKEN_COOKIE: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000,
};

const REFRESH_TOKEN_COOKIE: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.LoginAdminUseCase) private loginUseCase: LoginAdminUseCase,
    @inject(TOKENS.RefreshTokenUseCase) private refreshTokenUseCase: RefreshTokenUseCase,
    @inject(TOKENS.GetCurrentUserUseCase) private getCurrentUserUseCase: GetCurrentUserUseCase,
    @inject(TOKENS.VerifyInviteTokenUseCase) private verifyInviteTokenUseCase: VerifyInviteTokenUseCase,
    @inject(TOKENS.AcceptInviteUseCase) private acceptInviteUseCase: AcceptInviteUseCase
  ) { }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE);
    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE);
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.loginUseCase.execute(req.body);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    
    ApiResponse.success(res, { user: result.user });
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('accessToken', baseCookieOptions);
    res.clearCookie('refreshToken', baseCookieOptions);
    ApiResponse.success(res, null, 200, 'Logged out');
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedError('No refresh token provided');

    const result = await this.refreshTokenUseCase.execute(refreshToken);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    ApiResponse.success(res, null, 200, 'Token refreshed');
  };

  me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const result = await this.getCurrentUserUseCase.execute(req.user.userId);
    ApiResponse.success(res, result);
  };

  verifyInviteToken = async (req: Request, res: Response): Promise<void> => {
    const result = await this.verifyInviteTokenUseCase.execute(req.params.token as string);
    ApiResponse.success(res, result);
  };

  acceptInvite = async (req: Request, res: Response): Promise<void> => {
    const result = await this.acceptInviteUseCase.execute(req.body);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    ApiResponse.success(res, { user: result.user }, 200, 'Account activated');
  };
}