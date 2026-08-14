export const ORGADMIN_PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // Users
  USER_CREATE: 'user.create',
  USER_VIEW: 'user.view',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_INVITE: 'user.invite',

  // Roles
  ROLE_CREATE: 'role.create',
  ROLE_VIEW: 'role.view',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  ROLE_ASSIGN: 'role.assign',

  // Notifications
  NOTIFICATION_CREATE: 'notification.create',
  NOTIFICATION_VIEW: 'notification.view',
  NOTIFICATION_UPDATE: 'notification.update',
  NOTIFICATION_SEND: 'notification.send',
  NOTIFICATION_DELETE: 'notification.delete',

  // Organization
  ORG_VIEW: 'org.view',
  ORG_UPDATE: 'org.update',

  // Subscription
  ORG_VIEW_PLAN: 'org.view_plan',
  ORG_UPGRADE_PLAN: 'org.upgrade_plan',

  // Audit Log
  AUDITLOG_VIEW: 'auditlog.view',
} as const;

export type OrgAdminPermission =
  (typeof ORGADMIN_PERMISSIONS)[keyof typeof ORGADMIN_PERMISSIONS];

export const ALL_ORG_ADMIN_PERMISSIONS: OrgAdminPermission[] = Object.values(ORGADMIN_PERMISSIONS);