import { apiClient } from "@/lib/api/client";
import { AuditLogReport } from '../types/audit-log.types';
import { ROUTES } from "@/config/routes";

export const auditLogApi ={
    auditLog : ()=> apiClient.get<AuditLogReport>(ROUTES.audit)
}