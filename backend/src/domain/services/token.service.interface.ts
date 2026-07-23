export interface TokenPayload {
  userId: string;
  roleIds: string[];
  roleSlugs: string[];
  organizationId?: string | null;
  tokenVersion?: number;
}

export interface ITokenService {
  signAccessToken(payload: TokenPayload): string;
  signRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}