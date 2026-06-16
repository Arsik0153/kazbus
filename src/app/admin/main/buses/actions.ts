'use server';

import { busSchema } from '@/data/schemas';
import { Bus } from '@/data/types';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';
import { createServerAction } from 'zsa';
import { z } from 'zod';

const busIdSchema = z.object({
    busId: z.string().trim().min(1, 'Некорректный ID автобуса'),
});

const saveBusSchema = z.intersection(
    busSchema,
    z.object({
        bus_id: z.string().trim().min(1).optional(),
    })
);

export const getBusesAction = createServerAction().handler(async () => {
    const response = await adminFetch('/buses/');

    if (!response.ok) {
        throw new Error(
            await getAdminApiError(
                response,
                'Не удалось получить список автобусов'
            )
        );
    }

    return (await response.json()) as Bus[];
});

export const getBusAction = createServerAction()
    .input(busIdSchema)
    .handler(async ({ input }) => {
        const response = await adminFetch(`/buses/${input.busId}/`);

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(response, 'Не удалось получить автобус')
            );
        }

        return (await response.json()) as Bus;
    });

export const saveBusAction = createServerAction()
    .input(saveBusSchema)
    .handler(async ({ input }) => {
        const { bus_id, ...bus } = input;
        const isEditing = Boolean(bus_id);
        const response = await adminFetch(
            isEditing ? `/buses/${bus_id}/` : '/buses/',
            {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bus),
            }
        );

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(
                    response,
                    isEditing
                        ? 'Не удалось обновить автобус'
                        : 'Не удалось сохранить автобус'
                )
            );
        }

        return (await response.json()) as Bus;
    });
