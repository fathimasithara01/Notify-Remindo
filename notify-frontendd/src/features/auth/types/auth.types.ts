// src/features/auth/types/auth.types.ts

// Mirror of backend PERMISSIONS constant (src/shared/constants/permissions.constant.ts)
// Keep this in sync manually — this is a frontend-only mirror, source of truth is backend.
export const PERMISSIONS = {
  ORG_CREATE: 'org:create',
  ORG_VIEW: 'org:view',
  ORG_UPDATE: 'org:update',
  ORG_DELETE: 'org:delete',
  ORG_BLOCK: 'org:block',
  ORG_RESET_ADMIN_PASSWORD: 'org:reset_admin_password',
  ORG_RESEND_INVITE: 'org:resend_invite',
  ORG_CANCEL_INVITE: 'org:cancel_invite',
  ORG_UPGRADE_PLAN: 'org:upgrade_plan',
  ORG_ASSIGN_SALESMAN: 'org:assign_salesman',

  DASHBOARD_VIEW: 'dashboard.view',
  AUDITLOG_VIEW: 'auditlog.view',

  USER_CREATE: 'user:create',
  USER_VIEW: 'user:view',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_INVITE: 'user:invite',

  ROLE_CREATE: 'role:create',
  ROLE_VIEW: 'role:view',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN: 'role:assign',

  PLATFORM_USER_MANAGE: 'platform:user:manage',
  PLATFORM_ORG_MANAGE: 'platform:org:manage',

  PLAN_CREATE: 'plan:create',
  PLAN_VIEW: 'plan:view',
  PLAN_UPDATE: 'plan:update',
  PLAN_DELETE: 'plan:delete',

  SUBSCRIPTION_CREATE: 'subscription:create',
  SUBSCRIPTION_VIEW: 'subscription:view',
  SUBSCRIPTION_UPDATE: 'subscription:update',
  SUBSCRIPTION_CANCEL: 'subscription:cancel',

  NOTIFICATION_CREATE: 'notification:create',
  NOTIFICATION_VIEW: 'notification:view',
  NOTIFICATION_UPDATE: 'notification:update',
  NOTIFICATION_SEND: 'notification:send',
  NOTIFICATION_DELETE: 'notification:delete',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}