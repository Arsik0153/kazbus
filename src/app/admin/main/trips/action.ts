'use server';

import { Trips } from '@/data/types';
import { createServerAction } from 'zsa';

import { adminLoginSchema } from '@/data/schemas';
import { getSession, login } from '@/lib/auth';

export const getTripsAction = createServerAction().handler(async () => {
    const response = await fetch(`${process.env.API_URL}/trip/trips/`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.log(response);
        throw 'Произошла ошибка при получении списка рейсов';
    }

    const result = (await response.json()) as Trips[];

    return result;
});

