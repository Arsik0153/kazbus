import { getAdminSession } from '@/lib/admin-auth';

type AdminFetchOptions = RequestInit & {
    requireAuth?: boolean;
};

export function getAdminApiUrl(path: string) {
    const apiUrl = process.env.API_URL?.replace(/\/$/, '');

    if (!apiUrl) {
        throw new Error('API_URL не настроен');
    }

    return `${apiUrl}${path}`;
}

export async function getAdminAuthHeaders() {
    const session = await getAdminSession();

    if (!session) {
        throw new Error('Сессия администратора истекла');
    }

    return {
        Authorization: `Token ${session.token}`,
    };
}

export async function adminFetch(path: string, options: AdminFetchOptions = {}) {
    const { requireAuth = true, headers, ...restOptions } = options;
    const authHeaders = requireAuth ? await getAdminAuthHeaders() : {};

    return fetch(getAdminApiUrl(path), {
        cache: 'no-store',
        ...restOptions,
        headers: {
            ...authHeaders,
            ...headers,
        },
    });
}

export async function getAdminApiError(
    response: Response,
    fallback: string
): Promise<string> {
    try {
        const body = (await response.json()) as Record<string, unknown>;
        const firstValue = Object.values(body)[0];

        if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
            return firstValue[0];
        }

        if (typeof firstValue === 'string') {
            return firstValue;
        }
    } catch {
        // Fallback below is enough for the UI.
    }

    return fallback;
}
