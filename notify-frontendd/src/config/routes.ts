export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  organizations: {
    list: '/organizations',
    new: '/organizations/new',
    detail: (id: string) => `/organizations/${id}`,
  },
  roles: {
    list: '/roles',
    detail: (id: string) => `/roles/${id}`,
  },
  permissions: '/permissions',
  subscriptions: {
    list: '/subscriptions',
    features: '/subscriptions/features',
  },
  notifications: '/notifications',
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
  },
  invites: '/invites',
  audit: '/audit',
  acceptInvite: (token: string) => `/accept-invite/${token}`,
} as const;