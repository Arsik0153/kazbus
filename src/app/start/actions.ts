'use server';

import { headers } from 'next/headers';
import { clientIpHeaders } from '@/lib/client-ip';

import { z } from 'zod';
import { createServerAction } from 'zsa';

export const sendOtpAction = createServerAction()
    .input(
        z.object({
            phone: z.string(),
        })
    )
    .handler(async ({ input }) => {
        const response = await fetch(
            `${process.env.API_URL}/accounts/send-code/`,
            {
                method: 'POST',
                body: JSON.stringify({ phone_number: input.phone }),
                headers: {
                    'Content-Type': 'application/json',
                    ...clientIpHeaders(
                        (await headers()).get('x-real-ip'),
                        process.env.TRUST_PROXY_CLIENT_IP === 'true'
                    ),
                },
            }
        );

        if (!response.ok) {
            throw 'Произошла ошибка при отправке сообщения';
        }

        return 'Сообщение отправлено';
    });
