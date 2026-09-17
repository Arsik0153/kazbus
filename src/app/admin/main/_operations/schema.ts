import { z } from 'zod';

export const operationsSchema = z.object({
    date: z.string().date(),
    summary: z.object({
        scheduledTrips: z.number().int().nonnegative(),
        completedTrips: z.number().int().nonnegative(),
        paidPassengers: z.number().int().nonnegative(),
        bookedPassengers: z.number().int().nonnegative(),
        boardedPassengers: z.number().int().nonnegative(),
        openIncidents: z.number().int().nonnegative(),
    }),
    trips: z.array(
        z.object({
            id: z.number().int(),
            runId: z.number().int().nullable(),
            route: z.string(),
            departureTime: z.string(),
            bus: z.string(),
            driver: z.string(),
            saleStatus: z.string(),
            runStatus: z.string().nullable(),
            paidPassengers: z.number().int(),
            bookedPassengers: z.number().int(),
            boardedPassengers: z.number().int(),
        })
    ),
    incidents: z.array(
        z.object({
            id: z.number().int(),
            tripId: z.number().int(),
            runId: z.number().int(),
            date: z.string().date(),
            title: z.string(),
            comment: z.string(),
            driverName: z.string(),
            createdAt: z.string().datetime({ offset: true }),
            resolvedAt: z.string().datetime({ offset: true }).nullable(),
            resolution: z.string(),
        })
    ),
});
