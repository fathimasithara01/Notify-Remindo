import { injectable } from 'tsyringe';
import { ITokenRevocationRegistry } from '../../domain/services/token-revocation-registry.interface';

@injectable()
export class InMemoryTokenRevocationRegistry implements ITokenRevocationRegistry {

  private minVersions = new Map<string, number>();

  isRevoked(userId: string, tokenVersion: number): boolean {
    const minVersion = this.minVersions.get(userId);
    return minVersion !== undefined && tokenVersion < minVersion;
  }

  revoke(userId: string, newMinVersion: number): void {
    this.minVersions.set(userId, newMinVersion);
  }
}