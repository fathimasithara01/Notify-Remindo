export interface BusinessReport {
  totalOrganizations: number;
  activeOrganizations: number;
  blockedOrganizations: number;
  totalActivePlans: number;
  organizationsByPlan: Record<string, number>;
}