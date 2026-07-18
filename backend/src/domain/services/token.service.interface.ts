export interface TokenPayload {
    userId: string;
    roleId: string;
    roleSlug: string;
}

export interface ITokenService {
    sign(payload: TokenPayload): string;
    verify(token: string): TokenPayload;
}