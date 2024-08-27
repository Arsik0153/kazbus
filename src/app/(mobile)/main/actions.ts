'use server';

import { AvailableDate, City, Ticket } from '@/data/types';
import { z } from 'zod';
import { createServerAction } from 'zsa';

export const getDatesAction = createServerAction()
    .input(
        z.object({
            from: z.number(),
            to: z.number(),
        })
    )
    .handler(async ({ input }) => {
        const response = await fetch(
            `${process.env.API_URL}/books/get-dates/?from_point=${input.from}&to_point=${input.to}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw 'Произошла ошибка при изменении данных';
        }

        const result = (await response.json()) as Ticket[];

        const formatted = result.map((item) => {
            return {
                date: item.from_date,
                price: item.price,
            };
        }) as AvailableDate[];

        return formatted;
    });

export const getCitiesAction = createServerAction().handler(async () => {
    const response = await fetch(`${process.env.API_URL}/trip_v2/cities/`, {
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
