import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow the user to access login and register pages without a token
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        return NextResponse.next();
    }

    // Check for token in cookies
    const token = req.cookies.get('token')?.value;

    // If no token, redirect to login
    if (!token) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Validate the token
    const response = await fetch(`http://localhost:8080/auth/validate-token/public?token=${token}`);

    if (response.status === 200) {
        // Token is valid, allow the request
        return NextResponse.next();
    } else {
        // Token is invalid, redirect to login
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login and register paths
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
    ],
};
