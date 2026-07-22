export interface TokenPayload {
  userId: string;
  roleId: string;
  roleSlug: string;
  organizationId?: string | null;
  tokenVersion?: number;
}

export interface ITokenService {
  signAccessToken(payload: TokenPayload): string;
  signRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}