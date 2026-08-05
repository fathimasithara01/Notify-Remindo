export const USER_STATUS_META = {
  invited: { label: 'Invited', variant: 'outline' as const },
  active: { label: 'Active', variant: 'default' as const },
  inactive: { label: 'Inactive', variant: 'secondary' as const },
} as const;

export const ROLE_STATUS_META = {
  active: { label: 'Active', variant: 'default' as const },
  inactive: { label: 'Inactive', variant: 'secondary' as const },
} as const;

export const DEFAULT_PAGE_SIZE = 10;