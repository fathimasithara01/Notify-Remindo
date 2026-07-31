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

    // Base key for all organization detail queries
    details: () => ['organizations', 'detail'] as const,

    // Specific organization detail
    detail: (id: string) =>
      [
        'organizations',
        'detail',
        id,
      ] as const,

    contacts: (id: string) => ['organizations', id, 'contacts'] as const,
    documents: (id: string) => ['organizations', id, 'documents'] as const,
  },

  roles: {
    all: () =>
      ['roles'] as const,

    lists: () =>
      ['roles', 'list'] as const,

    list: (page: number) =>
      [
        'roles',
        'list',
        page,
      ] as const,

    details: () =>
      ['roles', 'detail'] as const,

    detail: (id: string) =>
      [
        'roles',
        'detail',
        id,
      ] as const,

    permissions: (id: string) =>
      [
        'roles',
        'detail',
        id,
        'permissions',
      ] as const,
  },

  permissions: {
    all: () =>
      ['permissions'] as const,
  },

  subscriptions: {
    all: () =>
      ["subscriptions"] as const,

    plans: {
      all: () =>
        [
          "subscriptions",
          "plans",
        ] as const,

      list: (
        filters?: {
          page?: number;
          limit?: number;
          status?:
          | "active"
          | "inactive"
          | "draft";
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
        [
          "subscriptions",
          "plans",
          "detail",
          id,
        ] as const,
    },

    features: {
      all: () =>
        [
          "subscriptions",
          "features",
        ] as const,

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
        [
          "subscriptions",
          "features",
          "detail",
          id,
        ] as const,
    },

    planFeatures: {
      all: () =>
        [
          "subscriptions",
          "plan-features",
        ] as const,

      byPlan: (planId: string) =>
        [
          "subscriptions",
          "plan-features",
          planId,
        ] as const,
    },

    organizationSubscriptions: {
      all: () =>
        [
          "subscriptions",
          "organization-subscriptions",
        ] as const,

      active: (
        organizationId: string
      ) =>
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
            status:
              filters?.status ?? "all",
          },
        ] as const,
    },
  },

  notifications: {
    all: () =>
      ['notifications'] as const,

    list: (
      status: string,
      page: number
    ) =>
      [
        'notifications',
        status,
        page,
      ] as const,
  },

  users: {
    all: () =>
      ['users'] as const,

    list: (page: number) =>
      [
        'users',
        'list',
        page,
      ] as const,

    detail: (id: string) =>
      [
        'users',
        'detail',
        id,
      ] as const,

    roles: (id: string) =>
      [
        'users',
        'detail',
        id,
        'roles',
      ] as const,
  },

  invites: {
    all: () =>
      ['invites'] as const,
  },

  audit: {
    all: () =>
      ['audit-logs'] as const,

    list: (page: number) =>
      [
        'audit-logs',
        'list',
        page,
      ] as const,
  },
} as const;