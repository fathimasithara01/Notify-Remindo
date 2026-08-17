import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { ROUTES } from '@/config/routes';
import { createLoginRedirectUrl } from '@/lib/auth/redirect';
import { NAV_ITEMS } from '@/config/nav-config';

const PROTECTED_PREFIX = '/super-admin';
const JWT_SECRET = process.env.JWT_SECRET;

function isPathMatch(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX);
  const isLoginPage = pathname === ROUTES.login;

  const isAuthenticated = Boolean(accessToken) || Boolean(refreshToken);

  // not logged in, trying to hit a protected route
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = createLoginRedirectUrl(request.url, pathname);
    return NextResponse.redirect(loginUrl);
  }

  // already logged in, trying to hit login page
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  // --- RBAC check (only for protected routes with a valid access token) ---
  if (isProtectedRoute && accessToken && pathname !== ROUTES.unauthorized) {
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not set — skipping permission check');
      return NextResponse.next();
    }

    try {
      const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(JWT_SECRET));
      const permissions = (payload.permissions as string[]) ?? [];
      const hasPermission = (p: string) => permissions.includes('*') || permissions.includes(p);

      const matchedItem = [...NAV_ITEMS]
        .filter((item) => isPathMatch(pathname, item.href))
        .sort((a, b) => b.href.length - a.href.length)[0];

      if (matchedItem?.permission && !hasPermission(matchedItem.permission)) {
        return NextResponse.redirect(new URL(ROUTES.unauthorized, request.url));
      }
    } catch {
      // access token expired/invalid — let the request through;
      // refreshToken flow (if any) or client-side AuthProvider will handle re-auth
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/super-admin/:path*', '/login'],
};