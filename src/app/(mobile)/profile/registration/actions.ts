'use server';

import { authedProcedure } from '@/actions';
import { passwordSchema, profileSchema } from '@/data/schemas';
import { getSession, signUp, logout } from '@/lib/auth';
import { dateToDTO } from '@/utils/helper.';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createServerAction } from 'zsa';

export const loginAction = createServerAction()
    .input(
        z.object({
            phone: z.string(),
            otp: z.string().min(4, 'Слишком короткий код'),
        })
    )
    .handler(async ({ input }) => {
        const response = await fetch(
            `${process.env.API_URL}/accounts/verify-code/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    phone_number: input.phone,
                    code: input.otp,
                    password1: '12345678',
                    password2: '12345678',
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            console.log(response);
            const data = await response.json();
            console.log(data);
            throw 'Произошла ошибка при подтверждении кода';
        }
        const data = await response.json();
        console.log(data);
        const { user_id, token } = data;

        await signUp({ phone: input.phone, token, user_id });

        return 'Успешно подтверждено';
    });

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
        redirect('/profile');

        return 'Упешно изменено';
    });

export const setPasswordAction = createServerAction()
    .input(passwordSchema)
    .handler(async ({ input }) => {
        if (input.password !== input.repeatPassword) {
            throw 'Пароли не совпадают';
        }

        const session = await getSession();
        const user = session?.user;
        if (!user) {
            throw 'Необходимо авторизоваться';
        }

        const response = await fetch(
            `${process.env.API_URL}/accounts/set-password/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    password1: input.password,
                    password2: input.repeatPassword,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${user.token}`,
                },
            }
        );
        if (!response.ok) {
            throw 'Произошла ошибка при установлении пароля';
        }

        return 'Пароль успешно установлен';
    });
