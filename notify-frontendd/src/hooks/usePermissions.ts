"use client";

import { useAuth } from "@/providers/authProvider";

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string) => !!user?.permissions.includes(permission);
  const hasAnyPermission = (permissions: string[]) => permissions.some(hasPermission);
  const hasAllPermissions = (permissions: string[]) => permissions.every(hasPermission);

  return {
    permissions: user?.permissions ?? [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}