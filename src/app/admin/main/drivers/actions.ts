'use server';

import { driverSchema } from '@/data/schemas';
import { Driver } from '@/data/types';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';
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

export const getDriversAction = createServerAction().handler(async () => {
    const response = await adminFetch('/drivers/');

    if (!response.ok) {
        throw new Error(
            await getAdminApiError(
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
        const response = await adminFetch(`/drivers/${input.driverId}/`);

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(
                    response,
                    'Не удалось получить водителя'
                )
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
        const response = await adminFetch(
            isEditing ? `/drivers/${input.driver_id}/` : '/drivers/',
            {
                method: isEditing ? 'PATCH' : 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(
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
        const response = await adminFetch(`/drivers/${input.driverId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_active: input.is_active }),
        });

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(
                    response,
                    'Не удалось изменить статус водителя'
                )
            );
        }

        return (await response.json()) as Driver;
    });
