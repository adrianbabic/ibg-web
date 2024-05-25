import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { HOST } from './constants';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        return NextResponse.next();
    }

    const token = req.cookies.get('token')?.value;

    if (!token) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    const response = await fetch(`${HOST}/auth/validate-token/public?token=${token}`);

    if (response.status === 200) {
        return NextResponse.next();
    } else {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        // match all the request types except these
        '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
    ],
};