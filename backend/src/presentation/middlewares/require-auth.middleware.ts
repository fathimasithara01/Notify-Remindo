import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { ITokenService } from '../../domain/services/token.service.interface';
import { TokenRevocationRegistry } from '../../infrastructure/cache/token-revocation-registry';
import { UnauthorizedError } from '../../domain/errors/domain.error';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new UnauthorizedError('Authentication required'));
  }

  try {
    const tokenService = container.resolve<ITokenService>(TOKENS.TokenService);
    const payload = tokenService.verifyAccessToken(token);

    const revocationRegistry = container.resolve<TokenRevocationRegistry>(
      TOKENS.TokenRevocationRegistry
    );
    if (revocationRegistry.isRevoked(payload.userId, payload.tokenVersion ?? 0)) {
      return next(new UnauthorizedError('Session has been revoked. Please log in again.'));
    }

    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired session'));
  }
}