'use server';

import { z } from 'zod';
import { createServerAction } from 'zsa';
import { adminLoginSchema } from '@/data/schemas';
import { getSession, login } from '@/lib/auth';

    export const loginAction = createServerAction()
    .input(adminLoginSchema)
    .handler(async ({ input }) => {
        const session = await getSession();
        if (session) {
            throw new Error('Вход уже выполнен');
        }

        try {
            await login({
                phone: input.username,
                password: input.password,
            });
        } catch (error) {
            throw error;
        }

        return 'Вход успешно выполнен';
    });
