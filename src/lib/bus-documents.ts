import { z } from 'zod';

export const BUS_DOCUMENT_KINDS = [
    'registration',
    'insurance',
    'inspection',
] as const;
export const MAX_BUS_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const busIdSchema = z.string().regex(/^\d{6}$/);

export const busDocumentKindSchema = z.enum(BUS_DOCUMENT_KINDS);
export const busDocumentStatusSchema = z.enum(['valid', 'expiring', 'expired']);

export const busDocumentSchema = z
    .object({
        id: z.number().int().positive(),
        busId: busIdSchema,
        kind: busDocumentKindSchema,
        name: z.string().min(1),
        contentType: z.enum(['application/pdf', 'image/jpeg', 'image/png']),
        size: z.number().int().nonnegative(),
        expiresOn: z.string().date().nullable(),
        status: busDocumentStatusSchema,
        uploadedBy: z.object({
            id: z.number().int().positive(),
            name: z.string(),
        }),
        createdAt: z.string().datetime({ offset: true }),
        downloadUrl: z.string(),
    })
    .superRefine((document, context) => {
        const expected = `/api_jol/buses/documents/${document.id}/download/`;
        if (document.downloadUrl !== expected) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['downloadUrl'],
                message: 'Некорректный адрес документа',
            });
        }
    });

export const busDocumentListSchema = z
    .array(busDocumentSchema)
    .superRefine((documents, context) => {
        const kinds = new Set<string>();
        for (const document of documents) {
            if (kinds.has(document.kind)) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Тип документа повторяется',
                });
            }
            kinds.add(document.kind);
        }
    });

export type BusDocumentKind = z.infer<typeof busDocumentKindSchema>;
export type BusDocumentStatus = z.infer<typeof busDocumentStatusSchema>;
export type BusDocument = z.infer<typeof busDocumentSchema>;

export type BusDocumentRow = {
    kind: BusDocumentKind;
    document: BusDocument | null;
    status: BusDocumentStatus | 'missing';
};

export const BUS_DOCUMENT_LABELS: Record<BusDocumentKind, string> = {
    registration: 'Регистрационный документ',
    insurance: 'Страховой полис',
    inspection: 'Техосмотр',
};

export const BUS_DOCUMENT_STATUS_LABELS: Record<
    BusDocumentStatus | 'missing',
    string
> = {
    valid: 'Действует',
    expiring: 'Скоро истекает',
    expired: 'Просрочен',
    missing: 'Не загружен',
};

export function buildBusDocumentRows(
    documents: BusDocument[]
): BusDocumentRow[] {
    const byKind = new Map(
        documents.map((document) => [document.kind, document])
    );
    return BUS_DOCUMENT_KINDS.map((kind) => {
        const document = byKind.get(kind) ?? null;
        return {
            kind,
            document,
            status: document?.status ?? 'missing',
        };
    });
}
