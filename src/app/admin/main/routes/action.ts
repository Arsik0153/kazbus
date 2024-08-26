'use server';

import { Routes } from '@/data/types';
import { createServerAction } from 'zsa';

export const getRoutesAction = createServerAction().handler(async () => {
    const response = await fetch(`${process.env.API_URL}/trip_v2/routes/`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.log(response);
        throw 'Произошла ошибка при получении списка маршрутов';
    }

    const result = (await response.json()) as Routes[];

    return result;
});
