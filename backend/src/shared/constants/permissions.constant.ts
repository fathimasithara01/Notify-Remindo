export const PERMISSIONS = {
  // Organization
  ORG_CREATE: 'org:create',
  ORG_VIEW: 'org:view',
  ORG_UPDATE: 'org:update',
  ORG_DELETE: 'org:delete',

  // User (org-level)
  USER_CREATE: 'user:create',
  USER_VIEW: 'user:view',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_INVITE: 'user:invite',

  // Role
  ROLE_CREATE: 'role:create',
  ROLE_VIEW: 'role:view',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN: 'role:assign',

  // Platform (super-admin scope)
  PLATFORM_USER_MANAGE: 'platform:user:manage',
  PLATFORM_ORG_MANAGE: 'platform:org:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);