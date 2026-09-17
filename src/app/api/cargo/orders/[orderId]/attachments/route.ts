import { NextRequest } from 'next/server';
import { z } from 'zod';

import { listCargoFiles, uploadCargoFile } from '@/lib/cargo-file-proxy';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ orderId: string }> };

async function orderId(context: RouteContext) {
    const params = await context.params;
    return z.coerce.number().int().positive().safeParse(params.orderId);
}

export async function GET(_request: NextRequest, context: RouteContext) {
    const parsed = await orderId(context);
    if (!parsed.success) {
        return Response.json({ error: 'Заказ не найден' }, { status: 400 });
    }
    return listCargoFiles({
        backendPath: `orders/${parsed.data}/attachments/`,
        allowedRoles: ['shipper', 'admin_cargo', 'cargo_driver'],
    });
}

export async function POST(request: NextRequest, context: RouteContext) {
    const parsed = await orderId(context);
    if (!parsed.success) {
        return Response.json({ error: 'Заказ не найден' }, { status: 400 });
    }
    return uploadCargoFile({
        request,
        backendPath: `orders/${parsed.data}/attachments/`,
        allowedRoles: ['shipper', 'admin_cargo', 'cargo_driver'],
        allowedKinds: ['document', 'delivery_proof'],
    });
}
