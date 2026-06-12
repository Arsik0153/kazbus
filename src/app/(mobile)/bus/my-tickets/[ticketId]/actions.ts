'use server';

import { TicketDetailed } from '@/data/types';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
import { createServerAction } from 'zsa';

export const getTicketByIdAction = createServerAction()
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

        const response = await fetch(
            `${process.env.API_URL}/books/get-ticket/${input.ticket_id}/`,
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

            throw 'Произошла ошибка при получении билета';
        }
        const result = (await response.json()) as TicketDetailed;

        return result;
    });

export const downloadTicketPdfAction = createServerAction()
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

        const response = await fetch(
            `${process.env.API_URL}/books/tickets/${input.ticket_id}/pdf/`,
            {
                headers: {
                    Authorization: `Token ${session.user.token}`,
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            console.log(response);
            const result = await response.json();
            console.log(result);

            throw 'Не удалось сформировать билет';
        }

        const pdf = await response.arrayBuffer();

        return {
            base64: Buffer.from(pdf).toString('base64'),
            filename: `jol-ticket-${input.ticket_id}.pdf`,
        };
    });
