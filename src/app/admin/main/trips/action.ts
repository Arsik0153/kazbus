'use server';

import { tripSchema } from '@/data/schemas';
import { Bus, Driver, Routes, Trips } from '@/data/types';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';
import { createServerAction } from 'zsa';
import { z } from 'zod';

export const getTripsAction = createServerAction().handler(async () => {
    const response = await adminFetch('/trip/trips/');

    if (!response.ok) {
        throw new Error(
            await getAdminApiError(
                response,
                'Не удалось получить список рейсов'
            )
        );
    }

    return (await response.json()) as Trips[];
});

export const getTripFormOptionsAction = createServerAction().handler(
    async () => {
        const [routesResponse, busesResponse, driversResponse] =
            await Promise.all([
                adminFetch('/trip_v2/routes/'),
                adminFetch('/buses/'),
                adminFetch('/drivers/'),
            ]);

        if (!routesResponse.ok) {
            throw new Error(
                await getAdminApiError(
                    routesResponse,
                    'Не удалось получить список маршрутов'
                )
            );
        }

        if (!busesResponse.ok) {
            throw new Error(
                await getAdminApiError(
                    busesResponse,
                    'Не удалось получить список автобусов'
                )
            );
        }

        if (!driversResponse.ok) {
            throw new Error(
                await getAdminApiError(
                    driversResponse,
                    'Не удалось получить список водителей'
                )
            );
        }

        const [routes, buses, drivers] = await Promise.all([
            routesResponse.json() as Promise<Routes[]>,
            busesResponse.json() as Promise<Bus[]>,
            driversResponse.json() as Promise<Driver[]>,
        ]);

        return { routes, buses, drivers };
    }
);

export const saveTripAction = createServerAction()
    .input(tripSchema)
    .handler(async ({ input }) => {
        const response = await adminFetch('/trip/trips/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...input,
                ticket_price: input.ticket_price.toFixed(2),
            }),
        });

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(response, 'Не удалось сохранить рейс')
            );
        }

        return (await response.json()) as Trips;
    });

export type TripFormValues = z.output<typeof tripSchema>;

// export const payTicketAction = createServerAction()
//     .input(
//         z.object({
//             ticket_id: z.number(),
//         })
//     )
//     .handler(async ({ input }) => {
//         const session = await getSession();

//         if (!session) {
//             throw 'Необходимо авторизоваться';
//         }

//         const response = await fetch(
//             `${process.env.API_URL}/payments/pay-ticket/`,
//             {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Token ${session?.user.token}`,
//                 },
//                 body: JSON.stringify({
//                     ticket_id: input.ticket_id,
//                 }),
//             }
//         );

//         if (!response.ok) {
//             console.log(response);
//             const result = await response.json();
//             console.log(result);

//             throw 'Произошла ошибка при оплате билета';
//         }

//         return 'Билет успешно оплачен';
//     });
