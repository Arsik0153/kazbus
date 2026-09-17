import { NextRequest, NextResponse } from 'next/server';

import { logoutAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
    const reason =
        request.nextUrl.searchParams.get('reason') === 'forbidden'
            ? 'forbidden'
            : 'expired';

    await logoutAdmin();
    return NextResponse.redirect(
        new URL(`/admin?session=${reason}`, request.nextUrl.origin)
    );
}
