'use server';

import { getAdminSession } from '@/lib/admin-auth';
import { driverSchema } from '@/data/schemas';
import { Driver } from '@/data/types';
import { createServerAction } from 'zsa';
import { z } from 'zod';

const driverIdSchema = z.object({
    driverId: z.number().int().positive(),
});

const saveDriverSchema = z.intersection(
    driverSchema,
    z.object({
        driver_id: z.coerce.number().int().positive().optional(),
    })
);

const driverStatusSchema = driverIdSchema.extend({
    is_active: z.boolean(),
});

function getApiUrl(path: string) {
    const apiUrl = process.env.API_URL?.replace(/\/$/, '');

    if (!apiUrl) {
        throw new Error('API_URL не настроен');
    }

    return `${apiUrl}${path}`;
}

async function getAuthorizedHeaders() {
    const session = await getAdminSession();

    if (!session) {
        throw new Error('Сессия администратора истекла');
    }

    return {
        Authorization: `Token ${session.token}`,
    };
}

async function getApiError(response: Response, fallback: string) {
    try {
        const body = (await response.json()) as Record<string, unknown>;
        const firstValue = Object.values(body)[0];

        if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
            return firstValue[0];
        }
        if (typeof firstValue === 'string') {
            return firstValue;
        }
    } catch {
        // Use the user-friendly fallback below.
    }

    return fallback;
}

export const getDriversAction = createServerAction().handler(async () => {
    const response = await fetch(getApiUrl('/drivers/'), {
        headers: await getAuthorizedHeaders(),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(
            await getApiError(
                response,
                'Не удалось получить список водителей'
            )
        );
    }

    return (await response.json()) as Driver[];
});

export const getDriverAction = createServerAction()
    .input(driverIdSchema)
    .handler(async ({ input }) => {
        const response = await fetch(
            getApiUrl(`/drivers/${input.driverId}/`),
            {
                headers: await getAuthorizedHeaders(),
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            throw new Error(
                await getApiError(response, 'Не удалось получить водителя')
            );
        }

        return (await response.json()) as Driver;
    });

export const saveDriverAction = createServerAction()
    .input(saveDriverSchema, { type: 'formData' })
    .handler(async ({ input }) => {
        const formData = new FormData();
        formData.set('full_name', input.full_name);
        formData.set('date_of_birth', input.date_of_birth);
        formData.set('license_number', input.license_number);
        formData.set('license_issue_date', input.license_issue_date);

        if (input.picture) {
            formData.set('picture', input.picture);
        }

        const isEditing = Boolean(input.driver_id);
        const response = await fetch(
            getApiUrl(
                isEditing ? `/drivers/${input.driver_id}/` : '/drivers/'
            ),
            {
                method: isEditing ? 'PATCH' : 'POST',
                headers: await getAuthorizedHeaders(),
                body: formData,
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            throw new Error(
                await getApiError(
                    response,
                    isEditing
                        ? 'Не удалось обновить водителя'
                        : 'Не удалось сохранить водителя'
                )
            );
        }

        return (await response.json()) as Driver;
    });

export const setDriverStatusAction = createServerAction()
    .input(driverStatusSchema)
    .handler(async ({ input }) => {
        const response = await fetch(
            getApiUrl(`/drivers/${input.driverId}/`),
            {
                method: 'PATCH',
                headers: {
                    ...(await getAuthorizedHeaders()),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_active: input.is_active }),
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            throw new Error(
                await getApiError(
                    response,
                    'Не удалось изменить статус водителя'
                )
            );
        }

        return (await response.json()) as Driver;
    });
