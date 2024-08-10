'use server';

import { Trip } from '@/data/types';
import { createServerAction } from 'zsa';

export const getDirectionsAction = createServerAction().handler(async () => {
    const response = await fetch(`${process.env.API_URL}/trips/directions`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const json = await response.json();
        console.log(json);
        throw 'Произошла ошибка получении при направлении';
    }

    const result = (await response.json()) as Trip[];

    return result;
});
