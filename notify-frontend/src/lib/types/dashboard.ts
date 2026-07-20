export interface PlanOrganizationCount {
  planId: string;
  planName: string;
  count: number;
}

export interface BusinessReport {
  totalOrganizations: number;
  activeOrganizations: number;
  blockedOrganizations: number;
  totalActivePlans: number;
  organizationsByPlan: PlanOrganizationCount[];
}