import { z } from 'zod';

export const supportStatusSchema = z.enum(['open', 'answered', 'closed']);
export type SupportStatus = z.infer<typeof supportStatusSchema>;

const supportTicketSchema = z.object({
    id: z.number().int().positive(),
    status: z.string(),
    serviceDate: z.string().nullable(),
    route: z.object({
        from: z.string(),
        to: z.string(),
    }),
});

const supportSummaryFields = {
    id: z.number().int().positive(),
    subject: z.string(),
    status: supportStatusSchema,
    ticket: supportTicketSchema,
    passenger: z.object({
        id: z.number().int().positive().nullable(),
        name: z.string(),
    }),
    messageCount: z.number().int().nonnegative(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    closedAt: z.string().datetime({ offset: true }).nullable(),
};

export const supportSummarySchema = z.object(supportSummaryFields);

export const supportDetailSchema = z.object({
    ...supportSummaryFields,
    messages: z.array(
        z.object({
            id: z.number().int().positive(),
            senderRole: z.enum(['passenger', 'company']),
            authorName: z.string(),
            text: z.string(),
            createdAt: z.string().datetime({ offset: true }),
        })
    ),
});

export const supportListSchema = z.object({
    count: z.number().int().nonnegative(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(supportSummarySchema),
});

export const supportCreateSchema = z.object({
    ticketId: z.number().int().positive(),
    subject: z.string().trim().min(1).max(120),
    message: z.string().trim().min(1).max(4000),
});

export const supportReplySchema = z.object({
    supportId: z.number().int().positive(),
    message: z.string().trim().min(1).max(4000),
});

export type SupportSummary = z.infer<typeof supportSummarySchema>;
export type SupportDetail = z.infer<typeof supportDetailSchema>;

export const supportStatusLabels: Record<SupportStatus, string> = {
    open: 'Ждёт ответа',
    answered: 'Есть ответ',
    closed: 'Закрыто',
};

export function getSupportApiError(body: unknown, fallback: string) {
    const parsed = z.record(z.unknown()).safeParse(body);

    if (!parsed.success) {
        return fallback;
    }

    const error = parsed.data.error ?? parsed.data.detail;
    if (typeof error === 'string') {
        return error;
    }

    const first = Object.values(parsed.data)[0];
    if (typeof first === 'string') {
        return first;
    }
    if (Array.isArray(first) && typeof first[0] === 'string') {
        return first[0];
    }

    return fallback;
}

export function formatSupportDate(value: string) {
    return new Intl.DateTimeFormat('ru-KZ', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Almaty',
    }).format(new Date(value));
}
