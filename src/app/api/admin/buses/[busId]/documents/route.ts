import { NextRequest } from 'next/server';

import {
    listBusDocuments,
    uploadBusDocument,
} from '@/lib/admin-bus-document-proxy';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ busId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
    const { busId } = await context.params;
    return listBusDocuments(request, busId);
}

export async function POST(request: NextRequest, context: RouteContext) {
    const { busId } = await context.params;
    return uploadBusDocument(request, busId);
}
