import { NextRequest } from 'next/server';

import { listCargoFiles, uploadCargoFile } from '@/lib/cargo-file-proxy';

export const runtime = 'nodejs';

export function GET() {
    return listCargoFiles({
        backendPath: 'driver/documents/',
        allowedRoles: ['cargo_driver'],
    });
}

export function POST(request: NextRequest) {
    return uploadCargoFile({
        request,
        backendPath: 'driver/documents/',
        allowedRoles: ['cargo_driver'],
        allowedKinds: ['license', 'identity', 'medical', 'other'],
    });
}
