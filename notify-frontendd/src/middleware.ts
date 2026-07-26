import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIX = '/super-admin';
const LOGIN_PATH = '/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  const isProtected = pathname.startsWith(PROTECTED_PREFIX);
  const isLoginPage = pathname.startsWith(LOGIN_PATH);

  if (isProtected && !token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/super-admin/:path*', '/login'],
};