import { NextRequest } from 'next/server';
import { z } from 'zod';

import { listCargoFiles, uploadCargoFile } from '@/lib/cargo-file-proxy';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ driverId: string }> };

async function driverId(context: RouteContext) {
    const params = await context.params;
    return z.coerce.number().int().positive().safeParse(params.driverId);
}

export async function GET(_request: NextRequest, context: RouteContext) {
    const parsed = await driverId(context);
    if (!parsed.success) {
        return Response.json({ error: 'Водитель не найден' }, { status: 400 });
    }
    return listCargoFiles({
        backendPath: `admin/drivers/${parsed.data}/documents/`,
        allowedRoles: ['admin_cargo'],
    });
}

export async function POST(request: NextRequest, context: RouteContext) {
    const parsed = await driverId(context);
    if (!parsed.success) {
        return Response.json({ error: 'Водитель не найден' }, { status: 400 });
    }
    return uploadCargoFile({
        request,
        backendPath: `admin/drivers/${parsed.data}/documents/`,
        allowedRoles: ['admin_cargo'],
        allowedKinds: ['license', 'identity', 'medical', 'other'],
    });
}
