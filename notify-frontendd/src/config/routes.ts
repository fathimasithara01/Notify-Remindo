export const ROUTES = {
  login: '/login',
  dashboard: '/super-admin/dashboard',
  organizations: {
    list: '/super-admin/organizations',
    new: '/super-admin/organizations/new',
    detail: (id: string) => `/super-admin/organizations/${id}`,
  },
  roles: {
    list: '/super-admin/roles',
    detail: (id: string) => `/super-admin/roles/${id}`,
  },
  permissions: '/super-admin/permissions',
  subscriptions: {
    list: '/super-admin/subscriptions',
    features: '/super-admin/subscriptions/features',
  },
  notifications: '/super-admin/notifications',
  users: {
    list: '/super-admin/users',
    detail: (id: string) => `/super-admin/users/${id}`,
  },
  invites: '/super-admin/invites',
  audit: '/super-admin/audit',
  acceptInvite: (token: string) => `/super-admin/accept-invite/${token}`,
} as const;