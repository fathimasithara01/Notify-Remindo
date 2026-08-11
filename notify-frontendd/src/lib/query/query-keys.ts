export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  dashboard: {
    report: () => ['dashboard', 'report'] as const,
  },

  organizations: {
    all: () => ['organizations'] as const,

    lists: () => ['organizations', 'list'] as const,

    list: (
      filters?: {
        page?: number;
        limit?: number;
        status?: 'active' | 'blocked';
        planId?: string;
        salesmanId?: string;
        search?: string;
      }
    ) =>
      ['organizations', 'list',
        {
          page: filters?.page ?? 1,
          limit: filters?.limit ?? 10,
          status: filters?.status ?? null,
          planId: filters?.planId ?? null,
          salesmanId: filters?.salesmanId ?? null,
          search: filters?.search ?? '',
        },
      ] as const,

    details: () => ['organizations', 'detail'] as const,

    detail: (id: string) =>
      [
        'organizations',
        'detail',
        id,
      ] as const,

    contacts: (id: string) => ['organizations', id, 'contacts'] as const,
    documents: (id: string) => ['organizations', id, 'documents'] as const,
  },

  users: {
    all: () => ['rbac', 'users'] as const,
    lists: () => [...queryKeys.users.all(), 'list'] as const,
    list: (filters: object) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    roles: (id: string) => [...queryKeys.users.detail(id), 'roles'] as const,
  },

  roles: {
    all: () => ['rbac', 'roles'] as const,
    lists: () => [...queryKeys.roles.all(), 'list'] as const,
    list: (filters: object) =>
      [...queryKeys.roles.lists(), filters] as const,
    details: () => [...queryKeys.roles.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.roles.details(), id] as const,
    permissions: (id: string) =>
      [...queryKeys.roles.detail(id), 'permissions'] as const,
  },

  permissions: {
    all: () => ['rbac', 'permissions'] as const,
    lists: () => [...queryKeys.permissions.all(), 'list'] as const,
    list: (filters: object) =>
      [...queryKeys.permissions.lists(), filters] as const,
    details: () => [...queryKeys.permissions.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.permissions.details(), id] as const,
  },

  subscriptions: {
    all: () => ["subscriptions"] as const,

    plans: {
      all: () => ["subscriptions", "plans"] as const,

      list: (
        filters?: {
          page?: number;
          limit?: number;
          status?: "active" | "inactive" | "draft";
          search?: string;
        }
      ) =>
        [
          "subscriptions",
          "plans",
          "list",
          {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 10,
            status: filters?.status ?? null,
            search: filters?.search ?? "",
          },
        ] as const,

      detail: (id: string) =>
        ["subscriptions", "plans", "detail", id] as const,
    },

    features: {
      all: () => ["subscriptions", "features"] as const,

      list: (
        filters?: {
          page?: number;
          limit?: number;
          status?: "active" | "inactive";
          search?: string;
        }
      ) =>
        [
          "subscriptions",
          "features",
          "list",
          {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 10,
            status: filters?.status ?? null,
            search: filters?.search ?? "",
          },
        ] as const,

      detail: (id: string) =>
        ["subscriptions", "features", "detail", id] as const,
    },

    planFeatures: {
      all: () => ["subscriptions", "plan-features"] as const,

      byPlan: (planId: string) =>
        ["subscriptions", "plan-features", planId] as const,
    },

    organizationSubscriptions: {
      all: () => ["subscriptions", "organization-subscriptions"] as const,

      active: (organizationId: string) =>
        [
          "subscriptions",
          "organization-subscriptions",
          "active",
          organizationId,
        ] as const,

      byOrganization: (
        organizationId: string,
        filters?: {
          page?: number;
          limit?: number;
          status?: string;
        }
      ) =>
        [
          "subscriptions",
          "organization-subscriptions",
          organizationId,
          {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 10,
            status: filters?.status ?? "all",
          },
        ] as const,
    },
  },

  notifications: {
    all: () => ['notifications'] as const,

    list: (status: string, page: number) =>
      ['notifications', status, page] as const,
  },

  invites: {
    all: () => ['invites'] as const,
  },

  audit: {
    all: () => ['audit-logs'] as const,

    list: (page: number) =>
      ['audit-logs', 'list', page] as const,
  },
} as const;