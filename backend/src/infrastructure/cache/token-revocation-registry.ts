import { injectable } from 'tsyringe';

@injectable()
export class TokenRevocationRegistry {
  private minVersions = new Map<string, number>();

  isRevoked(userId: string, tokenVersion: number): boolean {
    const minVersion = this.minVersions.get(userId);
    return minVersion !== undefined && tokenVersion < minVersion;
  }

  revoke(userId: string, newMinVersion: number): void {
    this.minVersions.set(userId, newMinVersion);
  }

  clear(userId: string): void {
    this.minVersions.delete(userId);
  }
}