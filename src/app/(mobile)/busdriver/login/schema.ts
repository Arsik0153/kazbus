import { z } from 'zod';

export const setBusDriverPasswordSchema = z
    .object({
        phone: z.string().regex(/^7\d{10}$/),
        password: z.string().min(8),
        repeat_password: z.string().min(8),
        onboarding_token: z.string().min(1),
    })
    .refine((value) => value.password === value.repeat_password, {
        path: ['repeat_password'],
        message: 'Пароли не совпадают',
    });
