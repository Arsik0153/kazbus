import { NextRequest } from 'next/server';

import {
    deleteBusDocument,
    downloadBusDocument,
} from '@/lib/admin-bus-document-proxy';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ documentId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
    const { documentId } = await context.params;
    return downloadBusDocument(request, documentId);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    const { documentId } = await context.params;
    return deleteBusDocument(request, documentId);
}
