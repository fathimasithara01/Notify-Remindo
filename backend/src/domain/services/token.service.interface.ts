export interface TokenPayload {
  userId: string;
  roleId: string;
  roleSlug: string;
  organizationId?: string | null;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}