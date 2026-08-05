
export interface ITokenRevocationRegistry {
  isRevoked(userId: string, tokenVersion: number): boolean;

  revoke(userId: string, newMinVersion: number): void;
}