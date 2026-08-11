import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../di/tokens';
import { IPermissionResolver } from '../../domain/services/IPermissionResolver';
import { Permission } from '../../shared/constants/permissions.constant';
import { IPlatformRoleRepository } from '../../domain/repositories/platform-role.repository.interface';

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  permissions: Set<Permission>;
  expiresAt: number;
}

@injectable()
export class PermissionResolver implements IPermissionResolver {
  private cache = new Map<string, CacheEntry>();

  constructor(@inject(TOKENS.PlatformRoleRepository) private roleRepository: IPlatformRoleRepository) {}

  async resolve(roleId: string): Promise<Set<Permission>> {
    const cached = this.cache.get(roleId);
    if (cached && cached.expiresAt > Date.now()) return cached.permissions;

    const role = await this.roleRepository.findById(roleId);
    const permissions = new Set((role?.permissionIds ?? []) as Permission[]);

    this.cache.set(roleId, { permissions, expiresAt: Date.now() + CACHE_TTL_MS });
    return permissions;
  }

  async hasPermission(roleId: string, permission: Permission): Promise<boolean> {
    return (await this.resolve(roleId)).has(permission);
  }

  invalidate(roleId: string): void {
    this.cache.delete(roleId);
  }
}