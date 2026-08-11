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
import { LogoutAllDevicesUseCase } from '../../application/auth/use-cases/logout-from-alldevice';
import { ResetPasswordUseCase } from '../../application/auth/use-cases/reset-password.use-case';
import { ChangePasswordUseCase } from '../../application/auth/use-cases/change-password.use-case'

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

@injectable()  //"Ee class DI container create cheyyan pattum. "Container, you are allowed to create this class."
export class AuthController {
  constructor( // Before I can work, I need these objects.  Ee controller work cheyyan munpe ivayokke venam.
    @inject(TOKENS.LoginAdminUseCase) private loginUseCase: LoginAdminUseCase, // Container, LoginAdminUseCase create cheythu ivide inject cheyyu.
    @inject(TOKENS.RefreshTokenUseCase) private refreshTokenUseCase: RefreshTokenUseCase,
    @inject(TOKENS.GetCurrentUserUseCase) private getCurrentUserUseCase: GetCurrentUserUseCase,
    @inject(TOKENS.VerifyInviteTokenUseCase) private verifyInviteTokenUseCase: VerifyInviteTokenUseCase,
    @inject(TOKENS.AcceptInviteUseCase) private acceptInviteUseCase: AcceptInviteUseCase,
    @inject(TOKENS.LogoutAllDevicesUseCase) private logoutAllDevicesUseCase: LogoutAllDevicesUseCase,
    @inject(TOKENS.ResetPasswordUseCase) private resetPasswordUseCase: ResetPasswordUseCase,
    @inject(TOKENS.ChangePasswordUseCase) private changePasswordUseCase: ChangePasswordUseCase,

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

  changePassword = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    await this.changePasswordUseCase.execute({
      userId: req.user.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });
    // tokenVersion just bumped server-side (inside resetPassword), so the
    // access token this request came in on is now stale for future calls —
    // clear cookies and make the frontend redirect to login.
    res.clearCookie('accessToken', baseCookieOptions);
    res.clearCookie('refreshToken', baseCookieOptions);
    ApiResponse.success(res, null, 200, 'Password changed. Please log in again.');
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    await this.resetPasswordUseCase.execute(req.body);
    ApiResponse.success(res, null, 200, 'Password reset successfully. Please log in.');
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

    const result = await this.getCurrentUserUseCase.execute(req.user.id);
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

  logoutAllDevices = async (req: Request, res: Response) => {
    await this.logoutAllDevicesUseCase.execute(req.body);

    res.clearCookie('accessToken', baseCookieOptions);
    res.clearCookie('refreshToken', baseCookieOptions);

    ApiResponse.success(res, null, 200, 'Logged out from all devices');
  };
}