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
    plans:
      "/super-admin/subscription-plans",

    features:
      "/super-admin/subscription-plans/features",

    planFeatures:
      "/super-admin/subscription-plans/plan-features",

    organizationSubscriptions:
      "/super-admin/organization-subscriptions",

    detail: (id: string) =>
      `/super-admin/subscription-plans/${id}`,
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