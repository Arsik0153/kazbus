'use server';

import { z } from 'zod';
import { createServerAction } from 'zsa';
import { adminLoginSchema } from '@/data/schemas';
import { getSession, login } from '@/lib/auth';

export const loginAction = createServerAction()
    .input(adminLoginSchema)
    .handler(async ({ input }) => {
        const response = await fetch(`${process.env.API_URL}/accounts/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: input.username,
                password: input.password,
            }),
        });

        if (!response.ok) {
            const result = await response.json();
            console.error(result);
            throw new Error('Неверные логин или пароль');
        }

        const data = await response.json();
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', data.token);
        }

        return {
            token: data.token,
            user: data.user,
        };
    });
