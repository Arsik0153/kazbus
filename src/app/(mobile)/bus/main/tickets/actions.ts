'use server';

import { authedProcedure } from '@/actions';
import {
    bookTicketSchema,
    CombinedBookingSchema,
    profileSchema,
} from '@/data/schemas';
import { BusSeats, Ticket } from '@/data/types';
import { getSession, logout, signUp } from '@/lib/auth';
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
            from: from_point.toString(),
            to: to_point.toString(),
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

export const getMyPassengersAction = createServerAction().handler(async () => {
    const session = await getSession();
    if (!session) {
        throw 'Необходимо авторизоваться';
    }

    const response = await fetch(
        `${process.env.API_URL}/accounts/my-passengers/`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${session?.user.token}`,
            },
        }
    );

    if (!response.ok) {
        throw 'Произошла ошибка при получении пассажиров';
    }

    const result = (await response.json()) as {
        id: number;
        full_name: string;
        document_type: string;
        document_number_or_iin: string;
        birth_date: string;
    }[];

    const passengers: User[] = result.map((passenger) => ({
        ...passenger,
        user_id: passenger.id,
    }));

    return passengers;
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
    .input(CombinedBookingSchema)
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

        const result = await response.json();
        console.log(result);

        return result;
    });

export const payTicketAction = createServerAction()
    .input(
        z.object({
            ticket_id: z.number(),
        })
    )
    .handler(async ({ input }) => {
        const session = await getSession();

        if (!session) {
            throw 'Необходимо авторизоваться';
        }
        console.log(input.ticket_id);

        const response = await fetch(
            `${process.env.API_URL}/payments/pay-ticket/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${session?.user.token}`,
                },
                body: JSON.stringify({
                    ticket_id: input.ticket_id,
                }),
            }
        );

        if (!response.ok) {
            console.log(response);
            const result = await response.json();
            console.log(result);

            throw 'Произошла ошибка при оплате билета';
        }

        return 'Билет успешно оплачен';
    });

export const getUserAction = authedProcedure
    .createServerAction()
    .handler(async ({ ctx }) => {
        return ctx.user;
    });

export const getBusSeatsAction = createServerAction()
    .input(
        z.object({
            trip_id: z.number(),
        })
    )
    .handler(async ({ input }) => {
        const { trip_id } = input;
        const session = await getSession();

        if (!session) {
            throw 'Необходимо авторизоваться';
        }
        const response = await fetch(`${process.env.API_URL}/bus-seats/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${session?.user.token}`,
            },
            body: JSON.stringify({
                trip_id,
            }),
        });

        if (!response.ok) {
            throw 'Произошла ошибка при получении списка мест';
        }

        const result = (await response.json()) as BusSeats;

        return {
            seats: result.seats.slice(0, 45),
            bus: result.bus,
        };
    });

export const updatePersonalInfoAction = createServerAction()
    .input(profileSchema)
    .handler(async ({ input }) => {
        const session = await getSession();
        const user = session?.user;
        if (!user) {
            throw 'Необходимо авторизоваться';
        }

        const response = await fetch(
            `${process.env.API_URL}/accounts/profile/personal-info/`,
            {
                method: 'PATCH',
                body: JSON.stringify({
                    full_name: input.full_name,
                    document_type: input.document_type,
                    document_number_or_iin: input.document_number_or_iin,
                    birth_date: dateToDTO(input.birth_date),
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${user.token}`,
                },
            }
        );
        if (!response.ok) {
            const data = await response.json();

            console.log(data);
            throw 'Произошла ошибка при изменении данных';
        }

        await logout();

        await signUp({
            phone: user.phone_number,
            token: user.token,
            user_id: user.user_id,
        });

        return 'Упешно изменено';
    });
