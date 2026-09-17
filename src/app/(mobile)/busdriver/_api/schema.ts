import { z } from 'zod';
import { busDriverSchema } from '@/lib/busdriver-schema';

import {
    runSchema,
    runStatusSchema,
    passengerStatusSchema,
} from '@/data/trip-run';
export { runStatusSchema, passengerStatusSchema } from '@/data/trip-run';

const tripSchema = z.object({
    id: z.number(),
    bus: z.object({
        id: z.string(),
        name: z.string(),
        state_number: z.string(),
        count_of_seats: z.number(),
        floors: z.number(),
        have_wifi: z.boolean(),
        have_toilet: z.boolean(),
        is_recumbent: z.boolean(),
        seats: z.array(
            z.object({
                seat_id: z.number(),
                seat_row: z.number(),
                seat_col: z.number(),
                seat_type: z.string(),
            })
        ),
    }),
});
export const assignmentSchema = z.object({ trip: tripSchema, run: runSchema });
export const workspaceSchema = z.object({
    driver: busDriverSchema,
    trips: z.array(assignmentSchema),
});
export type DriverWorkspace = z.infer<typeof workspaceSchema>;
export type Assignment = z.infer<typeof assignmentSchema>;
export type RunStatus = z.infer<typeof runStatusSchema>;
export type PassengerStatus = z.infer<typeof passengerStatusSchema>;
export type DriverMode =
    | 'home'
    | 'trip'
    | 'passengers'
    | 'history'
    | 'vehicle'
    | 'profile'
    | 'issues'
    | 'seats';
export const statusLabels: Record<RunStatus, string> = {
    bus_arrival: 'Подача автобуса',
    boarding: 'Посадка',
    departure: 'Отправление',
    enroute: 'В пути',
    arrival: 'Рейс завершён',
};
export const passengerLabels: Record<PassengerStatus, string> = {
    waiting: 'Ожидает посадку',
    boarded: 'На рейсе',
    missed: 'Не пришёл',
};
export const nextStatus: Partial<Record<RunStatus, RunStatus>> = {
    bus_arrival: 'boarding',
    boarding: 'departure',
    departure: 'enroute',
    enroute: 'arrival',
};
