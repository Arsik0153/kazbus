'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { driverFetch } from './client';
import { passengerStatusSchema, runStatusSchema } from './schema';

const ids = {
    tripId: z.number().int().positive(),
    runId: z.string().regex(/^\d+$/),
};
const commandSchema = z.discriminatedUnion('kind', [
    z.object({ ...ids, kind: z.literal('status'), status: runStatusSchema }),
    z.object({
        ...ids,
        kind: z.literal('passenger'),
        passengerId: z.string().regex(/^\d+$/),
        status: passengerStatusSchema,
    }),
    z.object({
        ...ids,
        kind: z.literal('incident'),
        title: z.string().trim().min(3).max(255),
        comment: z.string().trim().min(3).max(4000),
    }),
    z.object({
        ...ids,
        kind: z.literal('scan'),
        payload: z.string().trim().min(1).max(10000),
    }),
]);
export type DriverCommand = z.infer<typeof commandSchema>;
export type CommandResult = { ok: true } | { ok: false; message: string };

export async function executeDriverCommand(
    input: DriverCommand
): Promise<CommandResult> {
    const parsed = commandSchema.safeParse(input);
    if (!parsed.success)
        return { ok: false, message: 'Проверьте заполненные поля.' };
    const command = parsed.data;
    const base = `/trip/trips/${command.tripId}/runs/${command.runId}`;
    let path: string;
    let method: string;
    let body: object;
    switch (command.kind) {
        case 'status':
            path = `${base}/status/`;
            method = 'PATCH';
            body = { status: command.status };
            break;
        case 'passenger':
            path = `${base}/passengers/${command.passengerId}/status/`;
            method = 'PATCH';
            body = { status: command.status };
            break;
        case 'incident':
            path = `${base}/incidents/`;
            method = 'POST';
            body = { title: command.title, comment: command.comment };
            break;
        case 'scan':
            path = `${base}/scan/`;
            method = 'POST';
            body = { payload: command.payload };
            break;
    }
    try {
        await driverFetch(path, { method, body: JSON.stringify(body) });
        revalidatePath('/busdriver', 'layout');
        revalidatePath(`/admin/main/trips/${command.tripId}`);
        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            message:
                error instanceof Error ? error.message : 'Сервис недоступен.',
        };
    }
}
