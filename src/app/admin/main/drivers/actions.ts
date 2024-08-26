'use server';

import { Driver } from '@/data/types';
import { createServerAction } from 'zsa';

export const getDriversAction = createServerAction().handler(async () => {
    const response = await fetch(`${process.env.API_URL}/buses/drivers/`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.log(response);
        throw 'Произошла ошибка при получении списка водителей';
    }

    const result = (await response.json()) as Driver[];

    return result;
});
