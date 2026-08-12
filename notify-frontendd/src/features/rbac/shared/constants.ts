import { PERMISSIONS, type Permission } from '@/config/permissions';
import type { RoleStatus } from '../roles/types/role.types';
import type { PlatformUserStatus } from '../users/types/user.types'; 

export const DEFAULT_PAGE_SIZE = 10;

export interface PermissionMeta {
  id: Permission;
  label: string;
  module: string;
}

export const ALL_PERMISSIONS: PermissionMeta[] = Object.entries(PERMISSIONS).map(
  ([, value]) => {
    const module = value.split('.')[0];
    const action = value.split('.').slice(1).join(' ').replace(/_/g, ' ');
    const label = action.charAt(0).toUpperCase() + action.slice(1);
    return { id: value, label, module };
  }
);

export const ROLE_STATUS_META: Record<RoleStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
};

export const USER_STATUS_META: Record<PlatformUserStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  invited: { label: 'Invited', variant: 'secondary' },
  inactive: { label: 'Inactive', variant: 'outline' },
  suspended: { label: 'Suspended', variant: 'destructive' },
};