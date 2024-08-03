'use server';

import { AvailableDate, City } from '@/data/types';
import { createServerAction } from 'zsa';

export const getDatesAction = createServerAction().handler(async () => {
    const response = await fetch(
        `${process.env.API_URL}/books/get-dates/?from_point=3&to_point=1`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw 'Произошла ошибка при изменении данных';
    }

    const result = (await response.json()) as AvailableDate[];

    return result;
});

export const getCitiesAction = createServerAction().handler(async () => {
    const response = await fetch(`${process.env.API_URL}/trips/points/`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw 'Произошла ошибка при получении городов';
    }

    const result = (await response.json()) as City[];

    return result;
});
