export function hasRole(userRoles: string[] | undefined, requiredRole: string): boolean {
  return !!userRoles?.includes(requiredRole);
}

export function hasAnyRole(userRoles: string[] | undefined, requiredRoles: string[]): boolean {
  return !!userRoles?.some((role) => requiredRoles.includes(role));
}