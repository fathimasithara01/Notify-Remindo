import { AuditLogReport } from '../types/audit-log.types';
import { ROUTES } from "@/config/routes";
import axiosInstance from "@/lib/api/axios-instance";

export const auditLogApi ={
    auditLog : ()=> axiosInstance.get<AuditLogReport>(ROUTES.audit)
}