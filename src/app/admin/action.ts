'use server';

import { z } from 'zod';
import { createServerAction } from 'zsa';
import { loginSchema } from '@/data/schemas';
import { getSession, login } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const checkLoginAction = createServerAction()
    .input(loginSchema)
    .handler(async ({ input }) => {
        const session = await getSession();
        if (session) {
            throw new Error('Вход уже выполнен');
        }

        try {
            await login({
                phone: input.phone_number,
                password: input.password,
            });
        } catch (error) {
            throw error;
        }

        redirect('/profile');

        return 'Вход успешно выполнен';
    });

export const loginAction = createServerAction()
    .input(
        z.object({
            username: z.string().min(1, 'Логин обязателен'),
            password: z.string().min(1, 'Пароль обязателен'),
        })
    )
    .handler(async ({ input }) => {
        const response = await fetch(`${process.env.API_URL}/auth/login/`, {
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

        // Предположим, что ответ содержит токен и другую информацию о сессии
        return {
            token: data.token,
            user: data.user,
        };
    });
