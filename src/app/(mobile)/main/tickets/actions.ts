'use server';

import { authedProcedure } from '@/actions';
import { bookTicketSchema, profileSchema } from '@/data/schemas';
import { Ticket } from '@/data/types';
import { getSession } from '@/lib/auth';
import { dateToDTO } from '@/utils/helper.';
import { z } from 'zod';
import { createServerAction } from 'zsa';
import { User } from './_components/select-passengers';

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

export const createPassenger = createServerAction()
    .input(profileSchema)
    .handler(async ({ input }) => {
        const session = await getSession();

        if (!session) {
            throw 'Необходимо авторизоваться';
        }

        const response = await fetch(
            `${process.env.API_URL}/accounts/create-passenger/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${session?.user.token}`,
                },
                body: JSON.stringify({
                    ...input,
                    birth_date: dateToDTO(input.birth_date),
                }),
            }
        );

        if (!response.ok) {
            console.log(response);

            throw 'Произошла ошибка при создании пассажира';
        }

        const result = (await response.json()) as number;

        return {
            ...input,
            user_id: result,
        } as User;
    });

export const createTicketAction = createServerAction()
    .input(bookTicketSchema)
    .handler(async ({ input }) => {
        const session = await getSession();

        if (!session) {
            throw 'Необходимо авторизоваться';
        }
        console.log(JSON.stringify(input));

        const response = await fetch(
            `${process.env.API_URL}/books/create-ticket/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${session?.user.token}`,
                },
                body: JSON.stringify(input),
            }
        );

        if (!response.ok) {
            console.log(response);
            const result = await response.json();
            console.log(result);

            throw 'Произошла ошибка при бронировании билета';
        }

        return 'Билет успешно забронирован';
    });

export const getUserAction = authedProcedure
    .createServerAction()
    .handler(async ({ ctx }) => {
        return ctx.user;
    });
