'use server';

import { revalidatePath } from 'next/cache';
import { adminFetch } from '@/lib/admin-api';
import {
    getSupportApiError,
    supportDetailSchema,
    supportReplySchema,
} from '@/lib/passenger-support';

type AdminSupportResult =
    | { ok: true; message: string }
    | { ok: false; needsLogin?: boolean; conflict?: boolean; message: string };

async function readBody(response: Response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

function revalidateSupport(id: number) {
    revalidatePath('/admin/main/passenger-support');
    revalidatePath(`/admin/main/passenger-support/${id}`);
}

export async function replyToPassengerSupport(
    input: unknown
): Promise<AdminSupportResult> {
    const parsed = supportReplySchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, message: 'Введите сообщение.' };
    }

    try {
        const response = await adminFetch(
            `/books/admin/support/${parsed.data.supportId}/messages/`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: parsed.data.message }),
            }
        );
        const body: unknown = await readBody(response);
        if (!response.ok) {
            return {
                ok: false,
                needsLogin: response.status === 401,
                conflict: response.status === 409,
                message: getSupportApiError(
                    body,
                    response.status === 409
                        ? 'Обращение уже закрыто.'
                        : 'Не удалось отправить ответ.'
                ),
            };
        }

        if (!supportDetailSchema.safeParse(body).success) {
            return { ok: false, message: 'Сервис вернул некорректный ответ.' };
        }
        revalidateSupport(parsed.data.supportId);
        return { ok: true, message: 'Ответ отправлен.' };
    } catch {
        return { ok: false, message: 'Сервер недоступен. Попробуйте ещё раз.' };
    }
}

export async function closePassengerSupport(
    input: unknown
): Promise<AdminSupportResult> {
    const parsed = supportReplySchema
        .pick({ supportId: true })
        .safeParse(input);
    if (!parsed.success) {
        return { ok: false, message: 'Некорректный номер обращения.' };
    }

    try {
        const response = await adminFetch(
            `/books/admin/support/${parsed.data.supportId}/close/`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: '{}',
            }
        );
        const body: unknown = await readBody(response);
        if (!response.ok) {
            return {
                ok: false,
                needsLogin: response.status === 401,
                message: getSupportApiError(
                    body,
                    'Не удалось закрыть обращение.'
                ),
            };
        }

        if (!supportDetailSchema.safeParse(body).success) {
            return { ok: false, message: 'Сервис вернул некорректный ответ.' };
        }
        revalidateSupport(parsed.data.supportId);
        return { ok: true, message: 'Обращение закрыто.' };
    } catch {
        return { ok: false, message: 'Сервер недоступен. Попробуйте ещё раз.' };
    }
}
