import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { ITokenService } from '../../domain/services/token.service.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UnauthorizedError } from '../../domain/errors/domain.error';

interface AccessTokenPayload {
  userId: string;
  roleId: string;
  roleName: string;
  organizationId?: string;
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

    const userRepository = container.resolve<IUserRepository>(TOKENS.UserRepository);
    const user = await userRepository.findById(payload.userId);

    if (!user || user.status !== 'active') {
      return next(new UnauthorizedError('Unauthorized'));
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return next(new UnauthorizedError('Session expired, please login again'));
    }

    req.user = {
      id: user.id,
      roleId: payload.roleId,
      organizationId: payload.organizationId,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}