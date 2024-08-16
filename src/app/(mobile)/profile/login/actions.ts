'use server';

import { loginSchema } from '@/data/schemas';
import { getSession, login } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createServerAction } from 'zsa';

export const loginAction = createServerAction()
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
