import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/config/routes';
import { createLoginRedirectUrl } from '@/lib/auth/redirect';

const PROTECTED_PREFIX = '/super-admin';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;

  const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX);

  const isLoginPage = pathname === ROUTES.login;

  if (isProtectedRoute && !accessToken) {
    const loginUrl = createLoginRedirectUrl(request.url, pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && accessToken) {
    return NextResponse.redirect(
      new URL(ROUTES.dashboard, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/super-admin/:path*',
    '/login',
  ],
};