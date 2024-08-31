'use server';

import { Trips } from '@/data/types';
import { createServerAction } from 'zsa';

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