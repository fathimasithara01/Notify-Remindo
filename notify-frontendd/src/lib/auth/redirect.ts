import { ROUTES } from '@/config/routes';

const REDIRECT_PARAM = 'redirect';

export function createLoginRedirectUrl(baseUrl: string, returnTo?: string): URL {
  const url = new URL(ROUTES.login, baseUrl);

  if (returnTo) {
    url.searchParams.set(
      REDIRECT_PARAM,
      returnTo
    );
  }

  return url;
}

export function getPostLoginRedirect(): string {
  return ROUTES.dashboard;
}

export function getLoginRedirectWithReturnTo(currentPath: string): string {
  const url = createLoginRedirectUrl(
    window.location.origin,
    currentPath
  );

  return `${url.pathname}${url.search}`;
}