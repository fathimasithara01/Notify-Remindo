import { queryKeys } from "@/lib/query/query-keys";
import { useQuery } from "@tanstack/react-query";
import { auditLogApi } from "../api/audit-log.api";

export function useAuditLog() {
    return useQuery({
        queryKey: queryKeys.audit.all(),
        queryFn: auditLogApi.auditLog,
    })
}