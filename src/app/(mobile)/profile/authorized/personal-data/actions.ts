'use server';

import { createServerAction } from 'zsa';
import { getSession, signUp, logout } from '@/lib/auth';
import { editProfileSchema } from '@/data/schemas';
import { dateToDTO } from '@/utils/helper.';
import { authedProcedure } from '@/actions';

export const getPersonalInfoAction = createServerAction().handler(async () => {
    const session = await getSession();
    return session?.user;
});

export const updatePersonalInfoAction = authedProcedure
    .createServerAction()
    .input(editProfileSchema)
    .handler(async ({ input, ctx }) => {
        const { user } = ctx;

        const response = await fetch(
            `${process.env.API_URL}/accounts/profile/personal-info/`,
            {
                method: 'PATCH',
                body: JSON.stringify({
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
            throw 'Произошла ошибка при изменении данных';
        }

        await logout();

        await signUp({
            phone: user.phone_number,
            token: user.token,
            user_id: user.user_id,
        });

        return 'Упешно сохранено';
    });
