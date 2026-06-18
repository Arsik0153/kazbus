'use server';

import { AvailableDate, City } from '@/data/types';
import { z } from 'zod';
import { createServerAction } from 'zsa';

export const getDatesAction = createServerAction()
    .input(
        z.object({
            from: z.number().int().positive(),
            to: z.number().int().positive(),
            passengerCount: z.number().int().positive(),
            dateFrom: z.string().date(),
            dateTo: z.string().date(),
        })
    )
    .handler(async ({ input }) => {
        const searchParams = new URLSearchParams({
            from_point: String(input.from),
            to_point: String(input.to),
            passenger_count: String(input.passengerCount),
            date_from: input.dateFrom,
            date_to: input.dateTo,
        });
        const response = await fetch(
            `${process.env.API_URL}/books/get-dates/?${searchParams.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            throw 'Не удалось получить доступные даты';
        }

        return (await response.json()) as AvailableDate[];
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
