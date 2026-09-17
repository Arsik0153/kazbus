import { NextRequest } from 'next/server';

import { deleteCargoFile, downloadCargoFile } from '@/lib/cargo-file-proxy';

export const runtime = 'nodejs';

type RouteContext = {
    params: Promise<{ scope: string; fileId: string }>;
};

function scope(value: string) {
    return value === 'order' || value === 'driver' ? value : null;
}

export async function GET(_request: NextRequest, context: RouteContext) {
    const params = await context.params;
    const parsedScope = scope(params.scope);
    if (!parsedScope) {
        return Response.json({ error: 'Файл не найден' }, { status: 404 });
    }
    return downloadCargoFile({ fileId: params.fileId, scope: parsedScope });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    const params = await context.params;
    const parsedScope = scope(params.scope);
    if (!parsedScope) {
        return Response.json({ error: 'Файл не найден' }, { status: 404 });
    }
    return deleteCargoFile({
        request,
        fileId: params.fileId,
        scope: parsedScope,
    });
}
