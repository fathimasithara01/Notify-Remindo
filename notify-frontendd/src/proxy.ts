import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIX = '/super-admin';
const LOGIN_PATH = '/login';
const DASHBOARD_PATH = '/super-admin/dashboard';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;  //Current request cheytha URL-il ninnu path mathram edukkunnu.

  const token = request.cookies.get('accessToken')?.value;

  const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX);
  const isLoginPage = pathname === LOGIN_PATH;

  // User is not authenticated and trying to access protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);

    // Remember the page user wanted to visit
    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // User is already authenticated and trying to visit login page
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
  }

  // Allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/super-admin/:path*', '/login']
};