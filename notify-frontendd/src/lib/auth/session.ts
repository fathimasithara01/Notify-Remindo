import { ROUTES } from '@/config/routes';

export function getPostLoginRedirect(): string {
  return ROUTES.dashboard;
}

export function getLoginRedirectWithReturnTo(currentPath: string): string {
  const url = new URL(ROUTES.login, window.location.origin);
  url.searchParams.set('redirect', currentPath);
  return url.pathname + url.search;
}