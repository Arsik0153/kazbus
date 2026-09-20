'use server';

import { z } from 'zod';
import { profileSchema } from '@/data/schemas';
import { dateToDTO } from '@/utils/helper.';
import { getSession } from '@/lib/auth';

async function conflictMessage(response: Response, fallback: string) {
    try {
        const payload: unknown = await response.json();
        const parsed = z.object({ error: z.string() }).safeParse(payload);
        return parsed.success ? parsed.data.error : fallback;
    } catch {
        return fallback;
    }
}

export async function deleteSavedPassenger(id: number) {
    const parsed = z.number().int().positive().safeParse(id);
    if (!parsed.success)
        return { ok: false, message: 'Некорректный пассажир.' };
    const session = await getSession();
    if (!session) return { ok: false, message: 'Войдите в аккаунт снова.' };
    try {
        const response = await fetch(
            `${process.env.API_URL}/accounts/profile/passenger-info/${parsed.data}/delete/`,
            {
                method: 'DELETE',
                headers: { Authorization: `Token ${session.user.token}` },
                cache: 'no-store',
            }
        );
        if (response.ok) return { ok: true, message: 'Пассажир удалён.' };
        if (response.status === 409)
            return {
                ok: false,
                message: await conflictMessage(
                    response,
                    'У пассажира есть история билетов. Удаление недоступно.'
                ),
            };
        if (response.status === 404)
            return {
                ok: false,
                message: 'Пассажир не найден. Обновите список.',
            };
        if (response.status === 401)
            return { ok: false, message: 'Сессия истекла. Войдите снова.' };
        return { ok: false, message: 'Не удалось удалить пассажира.' };
    } catch {
        return { ok: false, message: 'Сервер недоступен. Попробуйте ещё раз.' };
    }
}

export async function updateSavedPassenger(
    input: z.input<typeof profileSchema> & { id: number }
) {
    const parsed = profileSchema
        .extend({ id: z.number().int().positive() })
        .safeParse(input);
    if (!parsed.success)
        return {
            ok: false,
            message: 'Проверьте ФИО, документ и дату рождения.',
        };
    const session = await getSession();
    if (!session) return { ok: false, message: 'Войдите в аккаунт снова.' };
    const { id, ...values } = parsed.data;
    try {
        const response = await fetch(
            `${process.env.API_URL}/accounts/profile/passenger-info/${id}/`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Token ${session.user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    birth_date: dateToDTO(values.birth_date),
                }),
                cache: 'no-store',
            }
        );
        if (response.ok)
            return { ok: true, message: 'Данные пассажира сохранены.' };
        if (response.status === 409)
            return {
                ok: false,
                message: await conflictMessage(
                    response,
                    'У пассажира есть история билетов. Изменение данных недоступно; добавьте нового пассажира.'
                ),
            };
        if (response.status === 401)
            return { ok: false, message: 'Сессия истекла. Войдите снова.' };
        return { ok: false, message: 'Не удалось изменить данные пассажира.' };
    } catch {
        return { ok: false, message: 'Сервер недоступен. Попробуйте ещё раз.' };
    }
}
