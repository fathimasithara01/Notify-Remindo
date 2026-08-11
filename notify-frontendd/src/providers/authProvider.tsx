'use client';

import { createContext, useContext, useCallback } from 'react';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AuthUser, Permission } from '@/features/auth/types/auth.types';

interface AuthContextValue {
  user: AuthUser | undefined;
  isLoading: boolean;
  isError: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useCurrentUser();

  const hasPermission = useCallback(
    (permission: Permission) => {
      if (!user) return false;
      return user.permissions.includes('*') || user.permissions.includes(permission);
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]) => {
      if (!user) return false;
      if (user.permissions.includes('*')) return true;
      return permissions.some((p) => user.permissions.includes(p));
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, isError, hasPermission, hasAnyPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}