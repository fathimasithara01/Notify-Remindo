import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
    "/login",
    "/forgot-password",
    "/reset-password",
];

export function middleware(
    request: NextRequest,
) {
    const { pathname } = request.nextUrl;

    const isPublicRoute =
        PUBLIC_ROUTES.some(
            (route) =>
                pathname === route ||
                pathname.startsWith(`${route}/`),
        );

    if (isPublicRoute) {
        return NextResponse.next();
    }

    const accessToken =
        request.cookies.get(
            "access_token",
        )?.value;

    if (!accessToken) {
        const loginUrl = new URL(
            "/login",
            request.url,
        );

        loginUrl.searchParams.set(
            "redirect",
            pathname,
        );

        return NextResponse.redirect(
            loginUrl,
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/platform/:path*",
    ],
};