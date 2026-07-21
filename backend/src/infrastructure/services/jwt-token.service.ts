import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../domain/services/token.service.interface';
import { env } from '../../config/env';

export class JwtTokenService implements ITokenService {
    sign(payload: TokenPayload): string {
        // const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
        // return jwt.sign(payload, env.JWT_SECRET, options);
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    }

    verify(token: string): TokenPayload {
        return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    }
}