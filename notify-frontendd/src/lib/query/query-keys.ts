export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  dashboard: {
    report: () => ['dashboard', 'report'] as const,
  },
  organizations: {
    all: () => ['organizations'] as const,
    list: (page: number) => ['organizations', page] as const,
    detail: (id: string) => ['organizations', id] as const,
  },
  roles: {
    all: () => ['roles'] as const,
    
    list: (page: number) => ['roles', page] as const,
    detail: (id: string) => ['roles', id] as const,
    permissions: (id: string) => ['roles', id, 'permissions'] as const,
  },
  permissions: {
    all: () => ['permissions'] as const,
  },
  subscriptions: {
    plans: () => ['subscriptzions', 'plans'] as const,
    plan: (id: string) => ['subscriptions', 'plans', id] as const,
    features: () => ['subscriptions', 'features'] as const,
  },
  notifications: {
    all: () => ['notifications'] as const,
    list: (status: string, page: number) => ['notifications', status, page] as const,
  },
  users: {
    all: () => ['users'] as const,
    list: (page: number) => ['users', page] as const,
    detail: (id: string) => ['users', id] as const,
    roles: (id: string) => ['users', id, 'roles'] as const,
  },
  invites: {
    all: () => ['invites'] as const,
  },
  audit: {
    all: () => ['audit-logs'] as const,
    list: (page: number) => ['audit-logs', page] as const,
  },
} as const;