'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';

const resolutionSchema = z.object({
    id: z.number().int().positive(),
    resolution: z.string().trim().min(1).max(2000),
});

export async function resolveIncident(input: z.input<typeof resolutionSchema>) {
    const parsed = resolutionSchema.safeParse(input);
    if (!parsed.success)
        return { ok: false, message: 'Укажите результат обработки обращения.' };
    try {
        const response = await adminFetch(
            `/trip/incidents/${parsed.data.id}/resolution/`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resolution: parsed.data.resolution }),
            }
        );
        if (!response.ok)
            return {
                ok: false,
                conflict: response.status === 409,
                message: await getAdminApiError(
                    response,
                    'Не удалось закрыть обращение.'
                ),
            };
        for (const page of ['support', 'monitoring', 'analytics'])
            revalidatePath(`/admin/main/${page}`);
        return { ok: true, message: 'Обращение закрыто.' };
    } catch {
        return { ok: false, message: 'Сервер недоступен. Попробуйте ещё раз.' };
    }
}
