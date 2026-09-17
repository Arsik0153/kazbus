import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminApiUrl } from '@/lib/admin-api';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';
import {
    BUS_DOCUMENT_KINDS,
    MAX_BUS_DOCUMENT_BYTES,
    busIdSchema,
    busDocumentListSchema,
    busDocumentSchema,
    type BusDocumentKind,
} from '@/lib/bus-documents';

const MAX_MULTIPART_BYTES = MAX_BUS_DOCUMENT_BYTES + 128 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
]);
const documentIdSchema = z.coerce.number().int().positive();
const expiresOnSchema = z.union([z.null(), z.literal(''), z.string().date()]);

class BusDocumentProxyError extends Error {
    constructor(
        message: string,
        readonly status: number
    ) {
        super(message);
        this.name = 'BusDocumentProxyError';
    }
}

function privateJson(body: unknown, status = 200) {
    return NextResponse.json(body, {
        status,
        headers: { 'Cache-Control': 'private, no-store' },
    });
}

function errorResponse(error: unknown) {
    if (error instanceof z.ZodError) {
        return privateJson(
            { error: 'Сервер вернул некорректные данные документа' },
            502
        );
    }
    if (error instanceof BusDocumentProxyError) {
        return privateJson({ error: error.message }, error.status);
    }
    return privateJson({ error: 'Сервис документов временно недоступен' }, 502);
}

function firstErrorMessage(body: unknown) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
    for (const value of Object.values(body)) {
        if (typeof value === 'string') return value;
        if (Array.isArray(value) && typeof value[0] === 'string')
            return value[0];
    }
    return null;
}

async function requireAdminSession(request: NextRequest) {
    const session = await getAdminSessionFromRequest(request);
    if (!session) {
        throw new BusDocumentProxyError('Сессия истекла. Войдите снова.', 401);
    }
    return session;
}

function requireSameOrigin(request: NextRequest) {
    const host =
        request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    const protocol =
        request.headers.get('x-forwarded-proto')?.split(',')[0] ??
        request.nextUrl.protocol.replace(':', '');
    const allowedOrigins = new Set([
        request.nextUrl.origin,
        ...(host ? [`${protocol}://${host}`] : []),
    ]);
    const origin = request.headers.get('origin');
    if (!origin || !allowedOrigins.has(origin)) {
        throw new BusDocumentProxyError('Недопустимый источник запроса', 403);
    }
}

async function backendRequest(
    request: NextRequest,
    path: string,
    options: RequestInit = {}
) {
    const session = await requireAdminSession(request);
    let response: Response;
    try {
        response = await fetch(getAdminApiUrl(path), {
            cache: 'no-store',
            ...options,
            headers: {
                Authorization: `Token ${session.token}`,
                ...options.headers,
            },
        });
    } catch {
        throw new BusDocumentProxyError(
            'Сервис документов временно недоступен',
            502
        );
    }

    if (!response.ok) {
        let body: unknown = null;
        try {
            body = await response.json();
        } catch {
            // A generic message is used below.
        }
        const fallback =
            response.status === 401
                ? 'Сессия истекла. Войдите снова.'
                : response.status === 403 || response.status === 404
                  ? 'Документ или автобус не найден.'
                  : response.status === 413
                    ? 'Файл должен быть не больше 10 МиБ.'
                    : 'Не удалось обработать документ.';
        throw new BusDocumentProxyError(
            firstErrorMessage(body) ?? fallback,
            response.status
        );
    }
    return response;
}

export async function listBusDocuments(request: NextRequest, busId: string) {
    try {
        const id = busIdSchema.parse(busId);
        const response = await backendRequest(
            request,
            `/buses/${id}/documents/`
        );
        const documents = busDocumentListSchema.parse(await response.json());
        if (documents.some((document) => document.busId !== id)) {
            throw new BusDocumentProxyError(
                'Сервис вернул документы другого автобуса',
                502
            );
        }
        return privateJson(documents);
    } catch (error) {
        return errorResponse(error);
    }
}

export async function uploadBusDocument(request: NextRequest, busId: string) {
    try {
        requireSameOrigin(request);
        const id = busIdSchema.parse(busId);
        await requireAdminSession(request);
        const contentLength = Number(request.headers.get('content-length'));
        if (!Number.isSafeInteger(contentLength) || contentLength <= 0) {
            throw new BusDocumentProxyError(
                'Не удалось определить размер файла',
                411
            );
        }
        if (contentLength > MAX_MULTIPART_BYTES) {
            throw new BusDocumentProxyError(
                'Файл должен быть не больше 10 МиБ.',
                413
            );
        }

        const incoming = await request.formData();
        const files = incoming.getAll('file');
        const file = files[0];
        const kind = incoming.get('kind');
        const expiresOn = incoming.get('expires_on');
        if (files.length !== 1 || !(file instanceof File) || file.size === 0) {
            throw new BusDocumentProxyError('Выберите один файл.', 400);
        }
        if (file.size > MAX_BUS_DOCUMENT_BYTES) {
            throw new BusDocumentProxyError(
                'Файл должен быть не больше 10 МиБ.',
                413
            );
        }
        if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
            throw new BusDocumentProxyError(
                'Поддерживаются только PDF, JPEG и PNG.',
                400
            );
        }
        if (
            typeof kind !== 'string' ||
            !BUS_DOCUMENT_KINDS.includes(kind as BusDocumentKind)
        ) {
            throw new BusDocumentProxyError('Выберите тип документа.', 400);
        }
        const parsedExpiry = expiresOnSchema.safeParse(expiresOn);
        if (!parsedExpiry.success) {
            throw new BusDocumentProxyError(
                'Укажите корректную дату окончания.',
                400
            );
        }

        const body = new FormData();
        body.set('file', file, file.name);
        body.set('kind', kind);
        if (parsedExpiry.data) body.set('expires_on', parsedExpiry.data);
        const response = await backendRequest(
            request,
            `/buses/${id}/documents/`,
            { method: 'POST', body }
        );
        const document = busDocumentSchema.parse(await response.json());
        if (document.busId !== id || document.kind !== kind) {
            throw new BusDocumentProxyError(
                'Сервис вернул данные другого документа',
                502
            );
        }
        return privateJson(document, 201);
    } catch (error) {
        return errorResponse(error);
    }
}

export async function downloadBusDocument(
    request: NextRequest,
    documentId: string
) {
    try {
        const id = documentIdSchema.parse(documentId);
        const response = await backendRequest(
            request,
            `/buses/documents/${id}/download/`
        );
        const contentType = response.headers.get('content-type')?.split(';')[0];
        if (!contentType || !ALLOWED_CONTENT_TYPES.has(contentType)) {
            throw new BusDocumentProxyError(
                'Сервис вернул файл неподдерживаемого типа',
                502
            );
        }
        const headers = new Headers({
            'Cache-Control': 'private, no-store',
            'Content-Type': contentType,
            'X-Content-Type-Options': 'nosniff',
        });
        for (const name of ['content-length', 'content-disposition']) {
            const value = response.headers.get(name);
            if (value) headers.set(name, value);
        }
        return new Response(response.body, { status: 200, headers });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function deleteBusDocument(
    request: NextRequest,
    documentId: string
) {
    try {
        requireSameOrigin(request);
        const id = documentIdSchema.parse(documentId);
        await backendRequest(request, `/buses/documents/${id}/`, {
            method: 'DELETE',
        });
        return new Response(null, { status: 204 });
    } catch (error) {
        return errorResponse(error);
    }
}
