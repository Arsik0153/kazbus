'use server';

import { headers } from 'next/headers';
import { clientIpHeaders } from '@/lib/client-ip';

import { z } from 'zod';
import { getAdminApiUrl, getAdminApiError } from '@/lib/admin-api';
import { getAdminSession, loginAdmin } from '@/lib/admin-auth';
import {
    companyPhoneSchema,
    companyRegistrationSchema,
    type CompanyRegistrationInput,
} from './schema';

export async function sendCompanyCode(phone: string) {
    const parsed = companyPhoneSchema.safeParse(phone);
    if (!parsed.success)
        return { ok: false as const, message: parsed.error.issues[0].message };
    try {
        const response = await fetch(
            getAdminApiUrl('/accounts/company-registration/send-code/'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...clientIpHeaders(
                        (await headers()).get('x-real-ip'),
                        process.env.TRUST_PROXY_CLIENT_IP === 'true'
                    ),
                },
                body: JSON.stringify({ phone_number: parsed.data }),
                cache: 'no-store',
            }
        );
        if (!response.ok)
            return {
                ok: false as const,
                message: await getAdminApiError(
                    response,
                    'Не удалось отправить код.'
                ),
            };
        return {
            ok: true as const,
            message: 'Код отправлен. Он действует пять минут.',
        };
    } catch {
        return {
            ok: false as const,
            message: 'Сервис недоступен. Попробуйте позже.',
        };
    }
}

export async function registerCompany(input: CompanyRegistrationInput) {
    if (await getAdminSession()) return { ok: true as const };
    const parsed = companyRegistrationSchema.safeParse(input);
    if (!parsed.success)
        return { ok: false as const, message: parsed.error.issues[0].message };
    let username: string;
    try {
        const response = await fetch(
            getAdminApiUrl('/accounts/company-registration/'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed.data),
                cache: 'no-store',
            }
        );
        if (!response.ok)
            return {
                ok: false as const,
                message: await getAdminApiError(
                    response,
                    'Не удалось зарегистрировать компанию.'
                ),
            };
        const result = z
            .object({
                username: z.string().min(1),
                user_id: z.number().int().positive(),
            })
            .parse(await response.json());
        username = result.username;
    } catch {
        return {
            ok: false as const,
            message:
                'Не удалось получить ответ. Если кабинет уже создан, войдите с указанным телефоном и паролем.',
        };
    }
    try {
        await loginAdmin({ username, password: parsed.data.password });
        return { ok: true as const };
    } catch {
        return {
            ok: false as const,
            message:
                'Компания зарегистрирована. Перейдите ко входу и используйте телефон как логин.',
        };
    }
}
