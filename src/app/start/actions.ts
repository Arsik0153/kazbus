'use server';

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
                },
            }
        );

        if (!response.ok) {
            throw 'Произошла ошибка при отправке сообщения';
        }

        return 'Сообщение отправлено';
    });
