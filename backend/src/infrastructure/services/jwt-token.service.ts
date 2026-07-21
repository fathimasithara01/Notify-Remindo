import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import {
  ITokenService,
  TokenPayload,
} from '../../domain/services/token.service.interface';
import { env } from '../../config/env';

@injectable()
export class JwtTokenService implements ITokenService {
  signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  }

  signRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  }
}