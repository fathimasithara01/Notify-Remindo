'use client';

import { createContext, useContext } from 'react';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AuthUser } from '@/features/auth/types/auth.types';

interface AuthContextValue {
  user: AuthUser | undefined;
  isLoading: boolean;
  isError: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useCurrentUser();

  return (
    <AuthContext.Provider value={{ user, isLoading, isError }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}