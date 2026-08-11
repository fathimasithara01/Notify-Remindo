import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { ITokenService } from '../../domain/services/token.service.interface';
import { IPlatformUserRepository } from '../../domain/repositories/platform-user.repository.interface';
import { UnauthorizedError } from '../../domain/errors/domain.error';

interface AccessTokenPayload {
  userId: string;
  roleId: string;
  roleName: string;
  tokenVersion: number;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return next(new UnauthorizedError('No token provided'));
    }

    const tokenService = container.resolve<ITokenService>(TOKENS.TokenService);
    const payload = tokenService.verifyAccessToken(token) as AccessTokenPayload;

    const platformUserRepo = container.resolve<IPlatformUserRepository>(TOKENS.PlatformUserRepository);
    const user = await platformUserRepo.findById(payload.userId);

    if (!user || user.status !== 'active') {
      return next(new UnauthorizedError('Unauthorized'));
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return next(new UnauthorizedError('Session expired, please login again'));
    }

    req.user = {
      id: user.id,
      roleId: payload.roleId,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}