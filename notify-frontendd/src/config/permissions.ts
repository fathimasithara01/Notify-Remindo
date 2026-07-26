export const PERMISSIONS = {
  role: { create: 'role.create', view: 'role.view', edit: 'role.edit', delete: 'role.delete' },
  permission: { view: 'permission.view' },
  organization: {
    create: 'organization.create',
    view: 'organization.view',
    edit: 'organization.edit',
    delete: 'organization.delete',
    block: 'organization.block',
    upgradePlan: 'organization.upgrade_plan',
    assignSalesman: 'organization.assign_salesman',
  },
  plan: { create: 'plan.create', view: 'plan.view', edit: 'plan.edit', delete: 'plan.delete' },
  feature: {
    create: 'feature.create',
    view: 'feature.view',
    edit: 'feature.edit',
    delete: 'feature.delete',
  },
  notification: {
    create: 'notification.create',
    view: 'notification.view',
    send: 'notification.send',
    delete: 'notification.delete',
  },
  dashboard: { view: 'dashboard.view' },
  user: { create: 'user.create', view: 'user.view', edit: 'user.edit', delete: 'user.delete' },
  auditlog: { view: 'auditlog.view' },
} as const;