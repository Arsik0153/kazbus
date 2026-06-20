'use server';

import {
    clearBusDriverSession,
    getBusDriverSession,
} from '@/lib/busdriver-auth';

export async function logoutBusDriverAction() {
    const session = await getBusDriverSession();
    const apiUrl = process.env.API_URL?.replace(/\/$/, '');
    if (session && apiUrl) {
        await fetch(`${apiUrl}/accounts/busdriver/logout/`, {
            method: 'POST',
            headers: { Authorization: `Token ${session.token}` },
            cache: 'no-store',
        }).catch(() => undefined);
    }
    clearBusDriverSession();
}
