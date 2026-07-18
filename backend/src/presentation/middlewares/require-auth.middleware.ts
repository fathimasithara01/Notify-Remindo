import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { ITokenService } from '../../domain/services/token.service.interface';
import { UnauthorizedError } from '../../domain/errors/domain.error';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (!token) {
    return next(new UnauthorizedError('Authentication required'));
  }

  try {
    const tokenService = container.resolve<ITokenService>(TOKENS.TokenService);
    req.user = tokenService.verify(token);
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired session'));
  }
}