import { getBusDriverSession } from '@/lib/busdriver-auth';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { assignmentSchema, workspaceSchema } from './schema';

export async function driverFetch(path: string, options: RequestInit = {}) {
    const session = await getBusDriverSession();
    if (!session) redirect('/busdriver/login');
    const api = process.env.API_URL?.replace(/\/$/, '');
    if (!api) throw new Error('Сервис рейсов недоступен. Попробуйте позже.');
    const response = await fetch(`${api}${path}`, {
        ...options,
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            Authorization: `Token ${session.token}`,
        },
    });
    if (response.status === 401)
        throw new Error('Сессия истекла. Войдите в аккаунт повторно.');
    if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const error = z
            .object({
                detail: z.string().optional(),
                error: z.string().optional(),
            })
            .safeParse(body);
        throw new Error(
            error.success
                ? error.data.detail ||
                      error.data.error ||
                      'Не удалось выполнить действие.'
                : 'Не удалось выполнить действие. Попробуйте снова.'
        );
    }
    return response;
}

export async function loadWorkspace(date: string, history: boolean) {
    const response = await driverFetch(
        `/trip/driver/workspace/?date=${encodeURIComponent(date)}`
    );
    const workspace = workspaceSchema.parse(await response.json());
    if (!history) return workspace;
    const historyResponse = await driverFetch('/trip/driver/history/');
    return {
        ...workspace,
        trips: z.array(assignmentSchema).parse(await historyResponse.json()),
    };
}
