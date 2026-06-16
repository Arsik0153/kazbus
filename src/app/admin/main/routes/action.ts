'use server';

import { routeSchema } from '@/data/schemas';
import { Routes } from '@/data/types';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';
import { createServerAction } from 'zsa';
import { z } from 'zod';

const routeIdSchema = z.object({
    routeId: z.number().int().positive(),
});

const saveRouteSchema = z.intersection(
    routeSchema,
    z.object({
        route_id: z.number().int().positive().optional(),
    })
);

export const getRoutesAction = createServerAction().handler(async () => {
    const response = await adminFetch('/trip_v2/routes/');

    if (!response.ok) {
        throw new Error(
            await getAdminApiError(
                response,
                'Не удалось получить список маршрутов'
            )
        );
    }

    return (await response.json()) as Routes[];
});

export const getRouteAction = createServerAction()
    .input(routeIdSchema)
    .handler(async ({ input }) => {
        const response = await adminFetch(`/trip_v2/routes/${input.routeId}/`);

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(response, 'Не удалось получить маршрут')
            );
        }

        return (await response.json()) as Routes;
    });

export const saveRouteAction = createServerAction()
    .input(saveRouteSchema)
    .handler(async ({ input }) => {
        const { route_id, ...route } = input;
        const isEditing = Boolean(route_id);
        const response = await adminFetch(
            isEditing ? `/trip_v2/routes/${route_id}/` : '/trip_v2/routes/',
            {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(route),
            }
        );

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(
                    response,
                    isEditing
                        ? 'Не удалось обновить маршрут'
                        : 'Не удалось сохранить маршрут'
                )
            );
        }

        return (await response.json()) as Routes;
    });

export const deleteRouteAction = createServerAction()
    .input(routeIdSchema)
    .handler(async ({ input }) => {
        const response = await adminFetch(`/trip_v2/routes/${input.routeId}/`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(
                await getAdminApiError(response, 'Не удалось удалить маршрут')
            );
        }

        return { routeId: input.routeId };
    });
