import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { CargoApiError, cargoFetch, getCargoSession } from '@/lib/cargo-auth';
import { cargoAttachmentSchema, type CargoRole } from '@/lib/cargo-contract';

export const MAX_CARGO_FILE_BYTES = 10 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_CARGO_FILE_BYTES + 128 * 1024;

type AttachmentKind = z.infer<typeof cargoAttachmentSchema>['kind'];

function errorResponse(error: unknown) {
    if (error instanceof z.ZodError) {
        return NextResponse.json(
            { error: 'Сервер вернул некорректный ответ' },
            { status: 502 }
        );
    }
    const message =
        error instanceof Error ? error.message : 'Не удалось обработать файл';
    const status =
        error instanceof CargoApiError && error.status >= 400
            ? error.status
            : 500;
    return NextResponse.json({ error: message }, { status });
}

async function requireRole(allowedRoles: CargoRole[]) {
    const session = await getCargoSession();
    if (!session) throw new CargoApiError('Сессия истекла', 401);
    if (!allowedRoles.includes(session.role)) {
        throw new CargoApiError('Нет доступа к этому файлу', 403);
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
        throw new CargoApiError('Недопустимый источник запроса', 403);
    }
}

export async function uploadCargoFile({
    request,
    backendPath,
    allowedRoles,
    allowedKinds,
}: {
    request: NextRequest;
    backendPath: string;
    allowedRoles: CargoRole[];
    allowedKinds: AttachmentKind[];
}) {
    try {
        requireSameOrigin(request);
        const session = await requireRole(allowedRoles);
        const contentLength = Number(request.headers.get('content-length'));
        if (!Number.isSafeInteger(contentLength) || contentLength <= 0) {
            throw new CargoApiError('Не удалось определить размер файла', 411);
        }
        if (contentLength > MAX_MULTIPART_BYTES) {
            throw new CargoApiError('Файл должен быть не больше 10 МиБ', 413);
        }

        const incoming = await request.formData();
        const files = incoming.getAll('file');
        const file = files[0];
        const kind = incoming.get('kind');
        if (files.length !== 1 || !(file instanceof File) || file.size === 0) {
            throw new CargoApiError('Выберите один файл', 400);
        }
        if (file.size > MAX_CARGO_FILE_BYTES) {
            throw new CargoApiError('Файл должен быть не больше 10 МиБ', 413);
        }
        if (
            typeof kind !== 'string' ||
            !allowedKinds.includes(kind as AttachmentKind)
        ) {
            throw new CargoApiError('Выберите тип документа', 400);
        }

        const body = new FormData();
        body.set('file', file, file.name);
        body.set('kind', kind);
        const response = await cargoFetch(session.role, backendPath, {
            method: 'POST',
            body,
        });
        const attachment = cargoAttachmentSchema.parse(await response.json());
        return NextResponse.json(attachment, { status: 201 });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function listCargoFiles({
    backendPath,
    allowedRoles,
}: {
    backendPath: string;
    allowedRoles: CargoRole[];
}) {
    try {
        const session = await requireRole(allowedRoles);
        const response = await cargoFetch(session.role, backendPath);
        const attachments = z
            .array(cargoAttachmentSchema)
            .parse(await response.json());
        return NextResponse.json(attachments);
    } catch (error) {
        return errorResponse(error);
    }
}

const fileIdSchema = z.coerce.number().int().positive();

export async function downloadCargoFile({
    fileId,
    scope,
}: {
    fileId: string;
    scope: 'order' | 'driver';
}) {
    try {
        const session = await requireRole([
            'shipper',
            'admin_cargo',
            'cargo_driver',
        ]);
        const parsedId = fileIdSchema.safeParse(fileId);
        if (!parsedId.success) {
            throw new CargoApiError('Файл не найден', 400);
        }
        const id = parsedId.data;
        const namespace =
            scope === 'order' ? 'attachments' : 'driver-documents';
        const response = await cargoFetch(
            session.role,
            `${namespace}/${id}/download/`
        );
        const headers = new Headers({
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff',
        });
        for (const name of [
            'content-type',
            'content-length',
            'content-disposition',
        ]) {
            const value = response.headers.get(name);
            if (value) headers.set(name, value);
        }
        return new Response(response.body, { status: 200, headers });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function deleteCargoFile({
    request,
    fileId,
    scope,
}: {
    request: NextRequest;
    fileId: string;
    scope: 'order' | 'driver';
}) {
    try {
        requireSameOrigin(request);
        const session = await requireRole([
            'shipper',
            'admin_cargo',
            'cargo_driver',
        ]);
        const parsedId = fileIdSchema.safeParse(fileId);
        if (!parsedId.success) {
            throw new CargoApiError('Файл не найден', 400);
        }
        const id = parsedId.data;
        const namespace =
            scope === 'order' ? 'attachments' : 'driver-documents';
        await cargoFetch(session.role, `${namespace}/${id}/`, {
            method: 'DELETE',
        });
        return new Response(null, { status: 204 });
    } catch (error) {
        return errorResponse(error);
    }
}
