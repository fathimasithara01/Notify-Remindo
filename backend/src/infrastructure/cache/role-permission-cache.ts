import { injectable } from 'tsyringe';
import { RoleWithPermissions } from '../../domain/entities/role.entity';

interface CacheEntry {
  value: RoleWithPermissions;
  expiresAt: number;
}

//Role permission database-il ninnu ella request-ilum edukkanda.
//  Oru pravashyam eduth memory-il save cheyyuka. Pinne kurachu neram ath use cheyyuka

const TTL_MS = 60 * 1000;

@injectable()
export class RolePermissionCache {
  private store = new Map<string, CacheEntry>(); //Ithu oru temporary box aanu.

  get(roleId: string): RoleWithPermissions | null {
    const entry = this.store.get(roleId);
    if (!entry || entry.expiresAt < Date.now()) {
      this.store.delete(roleId);
      return null;
    }
    return entry.value;
  }

  set(roleId: string, value: RoleWithPermissions): void {
    this.store.set(roleId, { value, expiresAt: Date.now() + TTL_MS });
  }

  invalidate(roleId: string): void {
    this.store.delete(roleId);
  }

  invalidateAll(): void {
    this.store.clear();
  }
}