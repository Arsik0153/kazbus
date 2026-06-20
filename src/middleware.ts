import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from './lib/admin-auth';
import { updateSession } from './lib/auth';
import {
    BUSDRIVER_SESSION_COOKIE,
    getBusDriverSessionFromRequest,
} from './lib/busdriver-auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAdminLogin = pathname === '/admin' || pathname === '/admin/';
    const isAdminArea = pathname.startsWith('/admin/main');
    const isBusDriverLogin = pathname === '/busdriver/login';
    const isBusDriverArea =
        pathname === '/busdriver' ||
        (pathname.startsWith('/busdriver/') && !isBusDriverLogin);

    if (isBusDriverLogin || isBusDriverArea) {
        const session = await getBusDriverSessionFromRequest(request);
        let isValid = false;
        if (session) {
            const apiUrl = process.env.API_URL?.replace(/\/$/, '');
            if (apiUrl) {
                try {
                    const response = await fetch(
                        `${apiUrl}/accounts/busdriver/me/`,
                        {
                            headers: {
                                Authorization: `Token ${session.token}`,
                            },
                            cache: 'no-store',
                        }
                    );
                    isValid = response.ok;
                } catch {
                    isValid = false;
                }
            }
        }

        if (isBusDriverArea && !isValid) {
            const response = NextResponse.redirect(
                new URL('/busdriver/login', request.url)
            );
            response.cookies.delete(BUSDRIVER_SESSION_COOKIE);
            return response;
        }
        if (isBusDriverLogin && isValid) {
            return NextResponse.redirect(new URL('/busdriver', request.url));
        }
    }

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
