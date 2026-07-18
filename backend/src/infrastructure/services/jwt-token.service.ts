import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload, } from '../../domain/services/token.service.interface';
import { env } from '../../config/env';

export class JwtTokenService implements ITokenService {
    sign(payload: TokenPayload): string {
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    }

    verify(token: string): TokenPayload {
        return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    }
}