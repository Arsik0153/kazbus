import { Profile } from '@/data/user';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type SessionUser = Profile & {
    user_id: number;
    token: string;
};

type SessionPayload = JWTPayload & {
    user: SessionUser;
    expires: string | Date;
};

const getSessionKey = () => {
    const secret = process.env.SESSION_SECRET?.trim();

    if (!secret) {
        return null;
    }

    return new TextEncoder().encode(secret);
};

const requireSessionKey = () => {
    const key = getSessionKey();

    if (!key) {
        throw new Error('SESSION_SECRET is not configured');
    }

    return key;
};

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7 days from now')
        .sign(requireSessionKey());
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
    const key = getSessionKey();

    if (!key || !input) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });

        return payload as SessionPayload;
    } catch {
        return null;
    }
}

type SignUpCredentials = {
    phone: string;
    token: string;
    user_id: number;
};

export async function signUp(data: SignUpCredentials) {
    // Verify credentials && get the user

    const response = await fetch(
        `${process.env.API_URL}/accounts/user-profile`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${data.token}`,
            },
        }
    );
    const json = await response.json();

    const user = {
        user_id: json.id,
        token: data.token,
        ...json.profile,
    };

    // Create the session
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });
}

type LoginCredentials = {
    phone: string;
    password: string;
};

export async function login(data: LoginCredentials) {
    // Verify credentials && get the user

    const loginResponse = await fetch(
        `${process.env.API_URL}/accounts/login/`,
        {
            body: JSON.stringify({
                phone_number: data.phone,
                password: data.password,
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (!loginResponse.ok) {
        throw 'Неверный номер телефона или пароль';
    }

    const loginData = (await loginResponse.json()) as { token: string };

    const response = await fetch(
        `${process.env.API_URL}/accounts/user-profile`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${loginData.token}`,
            },
        }
    );
    const json = await response.json();

    const user = {
        user_id: json.id,
        token: loginData.token,
        ...json.profile,
    };

    // Create the session
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });
}

export async function logout() {
    // Destroy the session
    cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession(): Promise<Session | null> {
    const session = cookies().get('session')?.value;
    if (!session) return null;

    const parsed = await decrypt(session);
    if (!parsed) return null;

    return {
        user: parsed.user,
        expires: String(parsed.expires),
    };
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    const parsed = await decrypt(session);
    const res = NextResponse.next();

    if (!parsed) {
        res.cookies.set({
            name: 'session',
            value: '',
            httpOnly: true,
            expires: new Date(0),
        });
        return res;
    }

    // Refresh the session so it doesn't expire
    parsed.expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: new Date(parsed.expires),
    });
    return res;
}

export type Session = {
    user: SessionUser;
    expires: string;
} | null;
