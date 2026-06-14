import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8;

const adminUserSchema = z.object({
    id: z.number().int().positive(),
    username: z.string().nullable(),
    full_name: z.string().nullable(),
});

const staffLoginResponseSchema = z.object({
    token: z.string().min(1),
    user: adminUserSchema.optional(),
});

const adminUserProfileSchema = z.object({
    id: z.number().int().positive(),
    profile: z.object({
        full_name: z.string().nullable().optional(),
        phone_number: z.string().nullable().optional(),
    }),
});

const adminSessionPayloadSchema = z.object({
    type: z.literal('admin'),
    token: z.string().min(1),
    user: adminUserSchema,
});

export type AdminUser = z.infer<typeof adminUserSchema>;
export type AdminSession = z.infer<typeof adminSessionPayloadSchema>;

type AdminCredentials = {
    username: string;
    password: string;
};

function getSessionKey() {
    const secret = process.env.SESSION_SECRET?.trim();

    if (!secret) {
        throw new Error('SESSION_SECRET is not configured');
    }

    return new TextEncoder().encode(secret);
}

async function createAdminSessionToken(session: AdminSession) {
    return new SignJWT(session)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${ADMIN_SESSION_DURATION_SECONDS}s`)
        .sign(getSessionKey());
}

export async function decryptAdminSession(
    value: string | undefined
): Promise<AdminSession | null> {
    if (!value) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(value, getSessionKey(), {
            algorithms: ['HS256'],
        });
        const result = adminSessionPayloadSchema.safeParse(payload);

        return result.success ? result.data : null;
    } catch {
        return null;
    }
}

export async function getAdminSession() {
    return decryptAdminSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
}

export async function getAdminSessionFromRequest(request: NextRequest) {
    return decryptAdminSession(
        request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    );
}

async function loadAdminUser(apiUrl: string, token: string, fallbackUsername: string) {
    const profileResponse = await fetch(`${apiUrl}/accounts/user-profile`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
        cache: 'no-store',
    });

    if (!profileResponse.ok) {
        return {
            id: 1,
            username: fallbackUsername,
            full_name: null,
        } satisfies AdminUser;
    }

    const profileResult = adminUserProfileSchema.safeParse(
        await profileResponse.json()
    );

    if (!profileResult.success) {
        return {
            id: 1,
            username: fallbackUsername,
            full_name: null,
        } satisfies AdminUser;
    }

    return {
        id: profileResult.data.id,
        username:
            profileResult.data.profile.phone_number ?? fallbackUsername ?? null,
        full_name: profileResult.data.profile.full_name ?? null,
    } satisfies AdminUser;
}

export async function loginAdmin(credentials: AdminCredentials) {
    const apiUrl = process.env.API_URL?.replace(/\/$/, '');

    if (!apiUrl) {
        throw new Error('API_URL не настроен');
    }

    let response: Response;

    try {
        response = await fetch(`${apiUrl}/accounts/staff-login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            cache: 'no-store',
        });
    } catch {
        throw new Error(
            'Сервер авторизации недоступен. Проверьте, что backend запущен'
        );
    }

    if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
            throw new Error('Неверный логин или пароль');
        }

        throw new Error('Сервис авторизации временно недоступен');
    }

    const result = staffLoginResponseSchema.safeParse(await response.json());

    if (!result.success) {
        throw new Error('Сервис авторизации вернул некорректный ответ');
    }

    const user =
        result.data.user ??
        (await loadAdminUser(apiUrl, result.data.token, credentials.username));

    const session: AdminSession = {
        type: 'admin',
        token: result.data.token,
        user,
    };
    const expires = new Date(
        Date.now() + ADMIN_SESSION_DURATION_SECONDS * 1000
    );

    cookies().set(
        ADMIN_SESSION_COOKIE,
        await createAdminSessionToken(session),
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            expires,
        }
    );

    return session;
}

export async function logoutAdmin() {
    // TODO: Switch to a dedicated backend logout endpoint when the contract is available.
    // We intentionally do not call delete-user here because logout must not remove accounts.

    cookies().set(ADMIN_SESSION_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
    });
}
