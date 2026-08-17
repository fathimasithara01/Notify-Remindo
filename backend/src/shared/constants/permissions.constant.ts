export const PERMISSIONS = {
  // Organization
  ORG_CREATE: 'org.create',
  ORG_VIEW: 'org.view',
  ORG_UPDATE: 'org.update',
  ORG_DELETE: 'org.delete',
  ORG_BLOCK: 'org.block',
  ORG_RESET_ADMIN_PASSWORD: 'org.reset_admin_password',
  ORG_RESEND_INVITE: 'org.resend_invite',
  ORG_CANCEL_INVITE: 'org.cancel_invite',
  ORG_UPGRADE_PLAN: 'org.upgrade_plan',
  ORG_ASSIGN_SALESMAN: 'org.assign_salesman',

  PLATFORM_USER_CREATE: 'user.create',
  PLATFORM_USER_VIEW: 'user.view',
  PLATFORM_USER_UPDATE: 'user.update',
  PLATFORM_USER_DELETE: 'user.delete',
  PLATFORM_USER_INVITE: 'user.invite',
  PLATFORM_RESET_ADMIN_PASSWORD: 'user.reset_admin_password',
  PLATFORM_BLOCK: 'user.block',

  DASHBOARD_VIEW: 'dashboard.view',
  AUDITLOG_VIEW: 'auditlog.view',

  // User (org-level)
  // USER_CREATE: 'user.create',
  // USER_VIEW: 'user.view',
  // USER_UPDATE: 'user.update',
  // USER_DELETE: 'user.delete',
  // USER_INVITE: 'user.invite',

  // Role
  ROLE_CREATE: 'role.create',
  ROLE_VIEW: 'role.view',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  ROLE_ASSIGN: 'role.assign',

  // Subscription Plan (catalog CRUD)
  PLAN_CREATE: 'plan.create',
  PLAN_VIEW: 'plan.view',
  PLAN_UPDATE: 'plan.update',
  PLAN_DELETE: 'plan.delete',

  // Feature
  FEATURE_VIEW: 'feature.view',
  FEATURE_CREATE: 'feature.create',
  FEATURE_UPDATE: 'feature.update',
  FEATURE_DELETE: 'feature.delete',
  FEATURE_BLOCK: 'feature.block',

  // Notification
  NOTIFICATION_CREATE: 'notification.create',
  NOTIFICATION_VIEW: 'notification.view',
  NOTIFICATION_UPDATE: 'notification.update',
  NOTIFICATION_SEND: 'notification.send',
  NOTIFICATION_DELETE: 'notification.delete',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);