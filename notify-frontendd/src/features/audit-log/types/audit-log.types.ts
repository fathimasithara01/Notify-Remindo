export type AuditTargetType =
  | 'Organization'
  | 'SubscriptionPlan'
  | 'Role'
  | 'User'
  | 'Feature'
  | 'ContactPerson';

export interface AuditLogReport {
  id: string;
  adminId: string; 
  action: string;
  targetType: AuditTargetType;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}