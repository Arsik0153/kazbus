import 'server-only';

import { getSession } from '@/lib/auth';

export class PassengerSessionError extends Error {
    constructor() {
        super('Необходимо войти в аккаунт');
        this.name = 'PassengerSessionError';
    }
}

export async function passengerSupportFetch(
    path: string,
    options: RequestInit = {}
) {
    const session = await getSession();
    if (!session) {
        throw new PassengerSessionError();
    }

    const apiUrl = process.env.API_URL?.replace(/\/$/, '');
    if (!apiUrl) {
        throw new Error('API_URL не настроен');
    }

    return fetch(`${apiUrl}${path}`, {
        cache: 'no-store',
        ...options,
        headers: {
            Authorization: `Token ${session.user.token}`,
            ...options.headers,
        },
    });
}
