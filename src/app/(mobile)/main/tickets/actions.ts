'use server';

import { Ticket } from '@/data/types';
import { z } from 'zod';
import { createServerAction } from 'zsa';

const schema = z.object({
    from_point: z.number(),
    to_point: z.number(),
    date: z.string().min(10).max(10),
    passenger_count: z.number(),
});

export const getTicketsAction = createServerAction()
    .input(schema)
    .handler(async ({ input }) => {
        const { from_point, to_point, date, passenger_count } = input;

        const searchParams = new URLSearchParams({
            from_point: from_point.toString(),
            to_point: to_point.toString(),
            date,
            passenger_count: passenger_count.toString(),
        });

        const response = await fetch(
            `${process.env.API_URL}/books/get-tickets/?${searchParams.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw 'Произошла ошибка при получении билетов';
        }

        const result = (await response.json()) as Ticket[];

        return result;
    });
