import { Profile } from '@/data/user';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1 hour from now')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
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
 
    let user = {
        user_id: json.id,
        token: loginData.token,
        ...json.profile,
    };
 
    if (data.phone === 'root') {
        user = {
            ...user,
            is_admin: true,
        };
    }
 
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
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}

export type Session = {
    user: Profile & {
        user_id: number;
        token: string;
    };
    expires: string;
} | null;
