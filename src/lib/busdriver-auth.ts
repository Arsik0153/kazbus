import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export const BUSDRIVER_SESSION_COOKIE = 'busdriver_session';
const SESSION_SECONDS = 60 * 60 * 8;

export const busDriverSchema = z.object({
    id: z.number().int().positive(),
    full_name: z.string(),
    phone_number: z.string(),
    owner_id: z.number().int().positive(),
    is_active: z.boolean(),
});

const sessionSchema = z.object({
    type: z.literal('busdriver'),
    token: z.string().min(1),
    driver: busDriverSchema,
});

export type BusDriverSession = z.infer<typeof sessionSchema>;

function key() {
    const secret = process.env.SESSION_SECRET?.trim();
    if (!secret) throw new Error('SESSION_SECRET is not configured');
    return new TextEncoder().encode(secret);
}

export async function decryptBusDriverSession(value?: string) {
    if (!value) return null;
    try {
        const { payload } = await jwtVerify(value, key(), {
            algorithms: ['HS256'],
        });
        const parsed = sessionSchema.safeParse(payload);
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

export async function getBusDriverSessionFromRequest(request: NextRequest) {
    return decryptBusDriverSession(
        request.cookies.get(BUSDRIVER_SESSION_COOKIE)?.value
    );
}

export async function getBusDriverSession() {
    return decryptBusDriverSession(
        cookies().get(BUSDRIVER_SESSION_COOKIE)?.value
    );
}

export async function createBusDriverSession(session: BusDriverSession) {
    const expires = new Date(Date.now() + SESSION_SECONDS * 1000);
    const value = await new SignJWT(session)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_SECONDS}s`)
        .sign(key());
    cookies().set(BUSDRIVER_SESSION_COOKIE, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires,
    });
}

export function clearBusDriverSession() {
    cookies().set(BUSDRIVER_SESSION_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
    });
}
