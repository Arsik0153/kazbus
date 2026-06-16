'use server';

import { busSchema } from '@/data/schemas';
import { Bus } from '@/data/types';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';
import { createServerAction } from 'zsa';

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

export const createBusAction = createServerAction()
    .input(busSchema)
    .handler(async ({ input }) => {
        const response = await adminFetch('/buses/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(
                    response,
                    'Не удалось сохранить автобус'
                )
            );
        }

        return (await response.json()) as Bus;
    });
