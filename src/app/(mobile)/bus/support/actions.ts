'use server';

import { revalidatePath } from 'next/cache';
import {
    getSupportApiError,
    supportCreateSchema,
    supportDetailSchema,
    supportReplySchema,
} from '@/lib/passenger-support';
import {
    passengerSupportFetch,
    PassengerSessionError,
} from '@/lib/passenger-support-api';

type ActionResult =
    | { ok: true; supportId: number; message: string }
    | { ok: false; needsLogin?: boolean; message: string };

async function readBody(response: Response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

function actionFailure(error: unknown): ActionResult {
    if (error instanceof PassengerSessionError) {
        return { ok: false, needsLogin: true, message: error.message };
    }

    return {
        ok: false,
        message: 'Сервер недоступен. Попробуйте ещё раз.',
    };
}

export async function createSupportRequest(
    input: unknown
): Promise<ActionResult> {
    const parsed = supportCreateSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            message: 'Заполните тему и опишите вопрос.',
        };
    }

    try {
        const response = await passengerSupportFetch('/books/support/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed.data),
        });
        const body: unknown = await readBody(response);

        if (!response.ok) {
            return {
                ok: false,
                needsLogin: response.status === 401,
                message: getSupportApiError(
                    body,
                    response.status === 404
                        ? 'Этот билет не найден в вашем аккаунте.'
                        : 'Не удалось создать обращение.'
                ),
            };
        }

        const support = supportDetailSchema.safeParse(body);
        if (!support.success) {
            return { ok: false, message: 'Сервис вернул некорректный ответ.' };
        }

        revalidatePath('/bus/support');
        return {
            ok: true,
            supportId: support.data.id,
            message: 'Обращение отправлено.',
        };
    } catch (error) {
        return actionFailure(error);
    }
}

export async function replyToSupportRequest(
    input: unknown
): Promise<ActionResult> {
    const parsed = supportReplySchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, message: 'Введите сообщение.' };
    }

    try {
        const response = await passengerSupportFetch(
            `/books/support/${parsed.data.supportId}/messages/`,
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
                message: getSupportApiError(
                    body,
                    response.status === 409
                        ? 'Обращение уже закрыто.'
                        : 'Не удалось отправить сообщение.'
                ),
            };
        }

        const support = supportDetailSchema.safeParse(body);
        if (!support.success) {
            return { ok: false, message: 'Сервис вернул некорректный ответ.' };
        }

        revalidatePath('/bus/support');
        revalidatePath(`/bus/support/${support.data.id}`);
        return {
            ok: true,
            supportId: support.data.id,
            message: 'Сообщение отправлено.',
        };
    } catch (error) {
        return actionFailure(error);
    }
}
