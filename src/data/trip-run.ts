import { z } from 'zod';

export const runStatusSchema = z.enum([
    'bus_arrival',
    'boarding',
    'departure',
    'enroute',
    'arrival',
]);
export const passengerStatusSchema = z.enum(['waiting', 'boarded', 'missed']);
const passengerSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    seatNumber: z.string(),
    ticketNumber: z.string(),
    boardingPoint: z.string(),
    destination: z.string(),
    fareLabel: z.string(),
    status: passengerStatusSchema,
    ticketStatus: z.string(),
});
export const runSchema = z.object({
    id: z.string(),
    dateIso: z.string(),
    tripDate: z.string(),
    routeLabel: z.string(),
    departureTime: z.string(),
    arrivalTime: z.string().nullable(),
    passengerCapacity: z.number(),
    status: runStatusSchema,
    passengers: z.array(passengerSchema),
    steps: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            state: z.enum(['done', 'current', 'upcoming']),
        })
    ),
    incidents: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            comment: z.string(),
            createdAt: z.string(),
            driverName: z.string(),
        })
    ),
});
