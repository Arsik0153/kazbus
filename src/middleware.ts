import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from './lib/admin-auth';
import { updateSession } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAdminLogin = pathname === '/admin' || pathname === '/admin/';
    const isAdminArea = pathname.startsWith('/admin/main');

    if (isAdminLogin || isAdminArea) {
        const adminSession = await getAdminSessionFromRequest(request);

        if (isAdminArea && !adminSession) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        if (isAdminLogin && adminSession) {
            return NextResponse.redirect(new URL('/admin/main', request.url));
        }
    }

    return await updateSession(request);
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
