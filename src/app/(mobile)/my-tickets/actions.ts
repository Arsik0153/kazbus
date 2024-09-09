'use server';

import { Ticket } from '@/data/types';
import { getSession } from '@/lib/auth';
import { createServerAction } from 'zsa';

export const getMyTicketsAction = createServerAction().handler(async () => {
    const session = await getSession();

    if (!session) {
        throw 'Необходимо авторизоваться';
    }

    const response = await fetch(
        `${process.env.API_URL}/accounts/my-tickets/`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${session?.user.token}`,
            },
        }
    );

    if (!response.ok) {
        console.log(response);
        const result = await response.json();
        console.log(result);

        throw 'Произошла ошибка при получении списка билетов';
    }
    const result = (await response.json()) as Ticket[];

    return result;
});
