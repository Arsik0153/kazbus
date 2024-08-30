'use server';

import { Bus } from '@/data/types';
import { createServerAction } from 'zsa';

export const getBusesAction = createServerAction().handler(async () => {
    const response = await fetch(`${process.env.API_URL}/buses/`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.log(response);
        throw 'Произошла ошибка при получении списка автобусов';
    }

    const result = (await response.json()) as Bus[];

    return result;
});
