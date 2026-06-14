'use server';

import { Routes } from '@/data/types';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';
import { createServerAction } from 'zsa';

export const getRoutesAction = createServerAction().handler(async () => {
    const response = await adminFetch('/trip_v2/routes/');

    if (!response.ok) {
        throw new Error(
            await getAdminApiError(
                response,
                'Не удалось получить список маршрутов'
            )
        );
    }

    return (await response.json()) as Routes[];
});
