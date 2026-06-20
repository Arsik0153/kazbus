'use server';

import { z } from 'zod';
import { createServerAction } from 'zsa';
import { busDriverSchema, createBusDriverSession } from '@/lib/busdriver-auth';

const apiUrl = () => {
    const value = process.env.API_URL?.replace(/\/$/, '');
    if (!value) throw new Error('API_URL не настроен');
    return value;
};

async function api(path: string, body: object) {
    const response = await fetch(`${apiUrl()}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const first = Object.values(data)[0];
        throw new Error(
            Array.isArray(first)
                ? String(first[0])
                : typeof first === 'string'
                  ? first
                  : 'Не удалось выполнить вход'
        );
    }
    return data;
}

const phoneSchema = z.object({ phone: z.string().regex(/^7\d{10}$/) });

export const initiateBusDriverAction = createServerAction()
    .input(phoneSchema)
    .handler(
        async ({ input }) =>
            (await api('/accounts/busdriver/initiate/', {
                phone_number: input.phone,
            })) as {
                next_step: 'verify_code' | 'password';
            }
    );

export const verifyBusDriverCodeAction = createServerAction()
    .input(phoneSchema.extend({ code: z.string().length(4) }))
    .handler(
        async ({ input }) =>
            (await api('/accounts/busdriver/verify-code/', {
                phone_number: input.phone,
                code: input.code,
            })) as {
                next_step: 'password' | 'set_password';
                onboarding_token: string;
            }
    );

const authResponseSchema = z.object({
    token: z.string().min(1),
    driver: busDriverSchema,
});

async function saveAuth(data: unknown) {
    const result = authResponseSchema.parse(data);
    await createBusDriverSession({ type: 'busdriver', ...result });
    return result.driver;
}

export const loginBusDriverAction = createServerAction()
    .input(
        phoneSchema.extend({
            password: z.string().min(8),
            onboarding_token: z.string().optional(),
        })
    )
    .handler(async ({ input }) =>
        saveAuth(
            await api('/accounts/busdriver/login/', {
                phone_number: input.phone,
                password: input.password,
                onboarding_token: input.onboarding_token,
            })
        )
    );

export const setBusDriverPasswordAction = createServerAction()
    .input(
        phoneSchema
            .extend({
                password: z.string().min(8),
                repeat_password: z.string().min(8),
                onboarding_token: z.string().min(1),
            })
            .refine((value) => value.password === value.repeat_password, {
                path: ['repeat_password'],
                message: 'Пароли не совпадают',
            })
    )
    .handler(async ({ input }) =>
        saveAuth(
            await api('/accounts/busdriver/set-password/', {
                password: input.password,
                repeat_password: input.repeat_password,
                onboarding_token: input.onboarding_token,
            })
        )
    );
