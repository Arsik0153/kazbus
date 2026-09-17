import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { z } from 'zod';

import {
    cargoAuthResponseSchema,
    cargoMeSchema,
    cargoRoleSchema,
    type CargoRole,
} from './cargo-contract';

export const CARGO_SESSION_COOKIE = 'cargo_session';
const SESSION_SECONDS = 60 * 60 * 12;

const cargoSessionSchema = z.object({
    type: z.literal('cargo'),
    role: cargoRoleSchema,
    token: z.string().min(1),
    user: z.object({
        id: z.number().int().positive(),
        phone_number: z.string(),
        full_name: z.string(),
    }),
});

export type CargoSession = z.infer<typeof cargoSessionSchema>;

function sessionKey() {
    const secret = process.env.SESSION_SECRET?.trim();
    if (!secret) throw new Error('SESSION_SECRET не настроен');
    return new TextEncoder().encode(secret);
}

export function getCargoApiUrl(path: string) {
    const apiUrl = process.env.API_URL?.replace(/\/$/, '');
    if (!apiUrl) throw new Error('API_URL не настроен');
    return `${apiUrl}/cargo/${path.replace(/^\//, '')}`;
}

export async function decryptCargoSession(value?: string) {
    if (!value) return null;

    try {
        const { payload } = await jwtVerify(value, sessionKey(), {
            algorithms: ['HS256'],
        });
        const parsed = cargoSessionSchema.safeParse(payload);
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

export async function getCargoSession() {
    return decryptCargoSession(cookies().get(CARGO_SESSION_COOKIE)?.value);
}

async function saveCargoSession(session: CargoSession) {
    const expires = new Date(Date.now() + SESSION_SECONDS * 1000);
    const value = await new SignJWT(session)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_SECONDS}s`)
        .sign(sessionKey());

    cookies().set(CARGO_SESSION_COOKIE, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires,
    });
}

export function clearCargoSession() {
    cookies().set(CARGO_SESSION_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
    });
}

async function readApiError(response: Response) {
    try {
        const payload = (await response.json()) as Record<string, unknown>;
        const detail = payload.detail;
        if (typeof detail === 'string') return detail;

        const first = Object.values(payload)[0];
        if (typeof first === 'string') return first;
        if (Array.isArray(first) && typeof first[0] === 'string')
            return first[0];
        if (first && typeof first === 'object') {
            const nested = Object.values(first as Record<string, unknown>)[0];
            if (Array.isArray(nested) && typeof nested[0] === 'string') {
                return nested[0];
            }
        }
    } catch {
        // The status-specific fallback below is clearer than a parsing error.
    }

    if (response.status === 401) return 'Неверный телефон или пароль';
    if (response.status === 403) return 'У этой учетной записи другая роль';
    if (response.status === 409) return 'Учетная запись уже существует';
    return 'Сервис Jol Cargo временно недоступен';
}

export class CargoApiError extends Error {
    constructor(
        message: string,
        readonly status: number
    ) {
        super(message);
        this.name = 'CargoApiError';
    }
}

async function authRequest(path: string, payload: Record<string, unknown>) {
    let response: Response;
    try {
        response = await fetch(getCargoApiUrl(path), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            cache: 'no-store',
        });
    } catch {
        throw new Error('Не удалось подключиться к серверу Jol Cargo');
    }

    if (!response.ok) {
        throw new CargoApiError(await readApiError(response), response.status);
    }
    const parsed = cargoAuthResponseSchema.safeParse(await response.json());
    if (!parsed.success) throw new Error('Сервер вернул некорректный ответ');

    await saveCargoSession({ type: 'cargo', ...parsed.data });
    return parsed.data;
}

export function loginCargo(input: {
    role: CargoRole;
    phone_number: string;
    password: string;
}) {
    return authRequest('auth/login/', input);
}

export function registerCargo(input: Record<string, unknown>) {
    return authRequest('auth/register/', input);
}

export async function getValidCargoSession(role: CargoRole) {
    const session = await getCargoSession();
    if (!session || session.role !== role) return null;

    try {
        const response = await fetch(getCargoApiUrl('auth/me/'), {
            headers: { Authorization: `Token ${session.token}` },
            cache: 'no-store',
        });
        if (!response.ok) return null;
        const parsed = cargoMeSchema.safeParse(await response.json());
        if (!parsed.success || !parsed.data.roles.includes(role)) return null;
        return session;
    } catch {
        return null;
    }
}

export async function cargoFetch(
    role: CargoRole,
    path: string,
    options: RequestInit = {}
) {
    const session = await getCargoSession();
    if (!session || session.role !== role) throw new Error('Сессия истекла');

    let response: Response;
    const isMultipart =
        typeof FormData !== 'undefined' && options.body instanceof FormData;
    try {
        response = await fetch(getCargoApiUrl(path), {
            cache: 'no-store',
            ...options,
            headers: {
                Authorization: `Token ${session.token}`,
                ...(options.body && !isMultipart
                    ? { 'Content-Type': 'application/json' }
                    : {}),
                ...options.headers,
            },
        });
    } catch {
        throw new Error('Не удалось подключиться к серверу Jol Cargo');
    }

    if (!response.ok) {
        throw new CargoApiError(await readApiError(response), response.status);
    }
    return response;
}
