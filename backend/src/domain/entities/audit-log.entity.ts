export type AuditTargetType =
  | 'Organization'
  | 'SubscriptionPlan'
  | 'Role'
  | 'User'
  | 'Feature'
  | 'ContactPerson';

export interface AuditLog {
  id: string;
  adminId: string; 
  action: string;
  targetType: AuditTargetType;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type NewAuditLog = Omit<AuditLog, 'id' | 'createdAt'>;